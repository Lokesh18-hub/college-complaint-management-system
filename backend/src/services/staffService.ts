import prisma from '../prisma/client';

export class StaffService {
  static async getAllStaff(departmentId?: string) {
    const where: any = {};
    if (departmentId && departmentId !== 'ALL') {
      where.departmentId = departmentId;
    }

    return await prisma.staff.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        department: {
          select: { id: true, name: true },
        },
        _count: {
          select: { complaints: true },
        },
      },
    });
  }

  static async getStaffById(id: string) {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        department: true,
        complaints: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            complaintNumber: true,
            title: true,
            status: true,
            priority: true,
            createdAt: true,
          },
        },
        _count: {
          select: { complaints: true },
        },
      },
    });

    if (!staff) {
      const error: any = new Error('Staff member not found');
      error.statusCode = 404;
      throw error;
    }

    return staff;
  }

  static async createStaff(data: {
    name: string;
    email: string;
    phone?: string;
    departmentId: string;
  }) {
    const dept = await prisma.department.findUnique({
      where: { id: data.departmentId },
    });
    if (!dept) {
      const error: any = new Error('Selected department does not exist');
      error.statusCode = 400;
      throw error;
    }

    return await prisma.staff.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        departmentId: data.departmentId,
      },
      include: {
        department: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async updateStaff(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      departmentId?: string;
    }
  ) {
    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error('Staff member not found');
      error.statusCode = 404;
      throw error;
    }

    if (data.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!dept) {
        const error: any = new Error('Selected department does not exist');
        error.statusCode = 400;
        throw error;
      }
    }

    return await prisma.staff.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.email ? { email: data.email.toLowerCase().trim() } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.departmentId ? { departmentId: data.departmentId } : {}),
      },
      include: {
        department: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async deleteStaff(id: string) {
    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error('Staff member not found');
      error.statusCode = 404;
      throw error;
    }

    // Check active assigned complaints
    const activeAssignedCount = await prisma.complaint.count({
      where: {
        assignedStaffId: id,
        status: { in: ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW'] },
      },
    });

    if (activeAssignedCount > 0) {
      const error: any = new Error(
        `Cannot delete staff member assigned to ${activeAssignedCount} active complaints. Reassign them first.`
      );
      error.statusCode = 400;
      throw error;
    }

    return await prisma.staff.delete({
      where: { id },
    });
  }
}
