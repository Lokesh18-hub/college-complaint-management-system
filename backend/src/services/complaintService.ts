import prisma from '../prisma/client';
import { generateComplaintNumber } from '../utils/complaintNumber';
import { NotificationService } from './notificationService';

export interface ComplaintFilterOptions {
  status?: string;
  priority?: string;
  category?: string;
  departmentId?: string;
  search?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class ComplaintService {
  static async createComplaint(
    studentId: string,
    data: {
      title: string;
      category: string;
      description: string;
      location: string;
      priority?: string;
      attachment?: {
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
      };
    }
  ) {
    const complaintNumber = await generateComplaintNumber();

    const complaint = await prisma.$transaction(async (tx) => {
      const created = await tx.complaint.create({
        data: {
          complaintNumber,
          studentId,
          title: data.title.trim(),
          category: data.category.trim(),
          description: data.description.trim(),
          location: data.location.trim(),
          priority: data.priority || 'MEDIUM',
          status: 'SUBMITTED',
        },
        include: {
          student: {
            select: { id: true, name: true, email: true, studentId: true, department: true },
          },
        },
      });

      // Create initial timeline event
      await tx.complaintUpdate.create({
        data: {
          complaintId: created.id,
          userId: studentId,
          comment: `Complaint ticket submitted with priority: ${created.priority}`,
          status: 'SUBMITTED',
        },
      });

      // If attachment is provided, save it
      if (data.attachment) {
        await tx.attachment.create({
          data: {
            complaintId: created.id,
            fileName: data.attachment.fileName,
            fileUrl: data.attachment.fileUrl,
            fileType: data.attachment.fileType,
            fileSize: data.attachment.fileSize,
          },
        });
      }

      return created;
    });

    // Notify student
    await NotificationService.createNotification({
      userId: studentId,
      title: 'Complaint Submitted',
      message: `Your complaint #${complaint.complaintNumber} has been received and is pending review.`,
      type: 'SUCCESS',
      link: `/student/complaints/${complaint.id}`,
    });

    return complaint;
  }

  static async getComplaints(options: ComplaintFilterOptions, userRole: 'STUDENT' | 'ADMIN', currentUserId: string) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(options.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Role security isolation: Students can only view their own complaints
    if (userRole === 'STUDENT') {
      where.studentId = currentUserId;
    } else if (options.studentId) {
      where.studentId = options.studentId;
    }

    if (options.status && options.status !== 'ALL') {
      where.status = options.status;
    }

    if (options.priority && options.priority !== 'ALL') {
      where.priority = options.priority;
    }

    if (options.category && options.category !== 'ALL') {
      where.category = options.category;
    }

    if (options.departmentId && options.departmentId !== 'ALL') {
      where.departmentId = options.departmentId;
    }

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = new Date(options.startDate);
      }
      if (options.endDate) {
        const end = new Date(options.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (options.search && options.search.trim()) {
      const query = options.search.trim();
      where.OR = [
        { complaintNumber: { contains: query } },
        { title: { contains: query } },
        { description: { contains: query } },
        { location: { contains: query } },
        { student: { name: { contains: query } } },
        { student: { studentId: { contains: query } } },
      ];
    }

    const sortField = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        include: {
          student: {
            select: { id: true, name: true, email: true, studentId: true, department: true },
          },
          department: {
            select: { id: true, name: true },
          },
          assignedStaff: {
            select: { id: true, name: true, email: true },
          },
          attachments: true,
          _count: {
            select: { updates: true, attachments: true },
          },
        },
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getComplaintById(complaintId: string, userRole: 'STUDENT' | 'ADMIN', currentUserId: string) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
            department: true,
            course: true,
            year: true,
            semester: true,
            phone: true,
          },
        },
        department: {
          select: { id: true, name: true, description: true },
        },
        assignedStaff: {
          select: { id: true, name: true, email: true, phone: true },
        },
        attachments: true,
        updates: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    // Role-based security check: Students can only view their own complaint
    if (userRole === 'STUDENT' && complaint.studentId !== currentUserId) {
      const error: any = new Error('Access denied. You cannot view complaints filed by other students.');
      error.statusCode = 403;
      throw error;
    }

    return complaint;
  }

  static async updateStatus(
    complaintId: string,
    status: string,
    comment: string | undefined,
    adminUserId: string,
    adminName: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { student: true },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.complaint.update({
        where: { id: complaintId },
        data: {
          status,
          ...(status === 'RESOLVED' && !complaint.resolvedAt ? { resolvedAt: new Date(), resolvedBy: adminName } : {}),
          ...(status === 'CLOSED' && !complaint.closedAt ? { closedAt: new Date() } : {}),
        },
        include: {
          student: true,
          department: true,
          assignedStaff: true,
        },
      });

      const timelineText = comment || `Status updated to ${status.replace('_', ' ')} by Administrator ${adminName}`;
      await tx.complaintUpdate.create({
        data: {
          complaintId,
          userId: adminUserId,
          comment: timelineText,
          status,
        },
      });

      return res;
    });

    // Notify student
    await NotificationService.createNotification({
      userId: complaint.studentId,
      title: `Complaint Status Updated: ${status.replace('_', ' ')}`,
      message: `Your complaint #${complaint.complaintNumber} is now marked as ${status.replace('_', ' ')}.`,
      type: status === 'RESOLVED' ? 'SUCCESS' : 'INFO',
      link: `/student/complaints/${complaint.id}`,
    });

    return updated;
  }

  static async updatePriority(
    complaintId: string,
    priority: string,
    adminUserId: string,
    adminName: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.complaint.update({
        where: { id: complaintId },
        data: { priority },
      });

      await tx.complaintUpdate.create({
        data: {
          complaintId,
          userId: adminUserId,
          comment: `Priority changed from ${complaint.priority} to ${priority} by ${adminName}`,
        },
      });

      return res;
    });

    return updated;
  }

  static async assignComplaint(
    complaintId: string,
    departmentId: string | null | undefined,
    assignedStaffId: string | null | undefined,
    comment: string | undefined,
    adminUserId: string,
    adminName: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { department: true, assignedStaff: true },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    let deptName = 'Unassigned';
    if (departmentId) {
      const dept = await prisma.department.findUnique({ where: { id: departmentId } });
      if (dept) deptName = dept.name;
    }

    let staffName = 'Unassigned';
    if (assignedStaffId) {
      const staff = await prisma.staff.findUnique({ where: { id: assignedStaffId } });
      if (staff) staffName = staff.name;
    }

    // Determine if status should automatically transition to ASSIGNED
    const shouldAutoAdvance = (complaint.status === 'SUBMITTED' || complaint.status === 'UNDER_REVIEW') && !!departmentId;
    const newStatus = shouldAutoAdvance ? 'ASSIGNED' : complaint.status;

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.complaint.update({
        where: { id: complaintId },
        data: {
          departmentId: departmentId || null,
          assignedStaffId: assignedStaffId || null,
          status: newStatus,
        },
        include: {
          department: true,
          assignedStaff: true,
        },
      });

      const timelineText = comment || `Assigned to Department: "${deptName}" and Staff: "${staffName}" by ${adminName}`;
      await tx.complaintUpdate.create({
        data: {
          complaintId,
          userId: adminUserId,
          comment: timelineText,
          status: newStatus,
        },
      });

      return res;
    });

    // Notify student
    await NotificationService.createNotification({
      userId: complaint.studentId,
      title: 'Complaint Assigned',
      message: `Your complaint #${complaint.complaintNumber} has been assigned to ${deptName} (${staffName}).`,
      type: 'INFO',
      link: `/student/complaints/${complaint.id}`,
    });

    return updated;
  }

  static async resolveComplaint(
    complaintId: string,
    resolutionDetails: string,
    adminUserId: string,
    adminName: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.complaint.update({
        where: { id: complaintId },
        data: {
          status: 'RESOLVED',
          resolutionDetails: resolutionDetails.trim(),
          resolvedBy: adminName,
          resolvedAt: new Date(),
        },
        include: {
          department: true,
          assignedStaff: true,
        },
      });

      await tx.complaintUpdate.create({
        data: {
          complaintId,
          userId: adminUserId,
          comment: `Resolution provided: ${resolutionDetails.trim()}`,
          status: 'RESOLVED',
        },
      });

      return res;
    });

    // Notify student
    await NotificationService.createNotification({
      userId: complaint.studentId,
      title: 'Complaint Resolved! Please Confirm',
      message: `Complaint #${complaint.complaintNumber} has been marked as RESOLVED. Please review the resolution details and close the ticket if satisfied.`,
      type: 'SUCCESS',
      link: `/student/complaints/${complaint.id}`,
    });

    return updated;
  }

  static async closeComplaint(
    complaintId: string,
    feedback: string | undefined,
    userId: string,
    userRole: 'STUDENT' | 'ADMIN',
    userName: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    // Role check: If student, must own the complaint
    if (userRole === 'STUDENT' && complaint.studentId !== userId) {
      const error: any = new Error('Access denied. You can only close your own complaints.');
      error.statusCode = 403;
      throw error;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.complaint.update({
        where: { id: complaintId },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
        },
      });

      const timelineText = feedback
        ? `Complaint closed by ${userName}. Feedback: "${feedback.trim()}"`
        : `Complaint verified and closed by ${userName}.`;

      await tx.complaintUpdate.create({
        data: {
          complaintId,
          userId,
          comment: timelineText,
          status: 'CLOSED',
        },
      });

      return res;
    });

    // Notify student
    await NotificationService.createNotification({
      userId: complaint.studentId,
      title: 'Complaint Ticket Closed',
      message: `Complaint #${complaint.complaintNumber} has been officially closed. Thank you for using CCMS.`,
      type: 'INFO',
      link: `/student/complaints/${complaint.id}`,
    });

    return updated;
  }

  static async addComment(
    complaintId: string,
    comment: string,
    userId: string,
    userRole: 'STUDENT' | 'ADMIN'
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    // Student can only comment on own complaint
    if (userRole === 'STUDENT' && complaint.studentId !== userId) {
      const error: any = new Error('Access denied.');
      error.statusCode = 403;
      throw error;
    }

    const update = await prisma.complaintUpdate.create({
      data: {
        complaintId,
        userId,
        comment: comment.trim(),
        status: complaint.status,
      },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // If student commented, notify admin; if admin commented, notify student
    if (userRole === 'ADMIN') {
      await NotificationService.createNotification({
        userId: complaint.studentId,
        title: 'New Update on Your Complaint',
        message: `Admin added an update on #${complaint.complaintNumber}: "${comment.substring(0, 80)}..."`,
        type: 'INFO',
        link: `/student/complaints/${complaint.id}`,
      });
    }

    return update;
  }

  static async addAttachment(
    complaintId: string,
    fileData: {
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    },
    userId: string,
    userRole: 'STUDENT' | 'ADMIN'
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    if (userRole === 'STUDENT' && complaint.studentId !== userId) {
      const error: any = new Error('Access denied.');
      error.statusCode = 403;
      throw error;
    }

    const attachment = await prisma.attachment.create({
      data: {
        complaintId,
        fileName: fileData.fileName,
        fileUrl: fileData.fileUrl,
        fileType: fileData.fileType,
        fileSize: fileData.fileSize,
      },
    });

    return attachment;
  }
}
