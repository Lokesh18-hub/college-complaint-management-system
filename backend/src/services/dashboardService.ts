import prisma from '../prisma/client';

export class DashboardService {
  static async getStudentDashboard(studentId: string) {
    const [
      total,
      submitted,
      underReview,
      assigned,
      inProgress,
      resolved,
      closed,
      recentComplaints,
    ] = await Promise.all([
      prisma.complaint.count({ where: { studentId } }),
      prisma.complaint.count({ where: { studentId, status: 'SUBMITTED' } }),
      prisma.complaint.count({ where: { studentId, status: 'UNDER_REVIEW' } }),
      prisma.complaint.count({ where: { studentId, status: 'ASSIGNED' } }),
      prisma.complaint.count({ where: { studentId, status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { studentId, status: 'RESOLVED' } }),
      prisma.complaint.count({ where: { studentId, status: 'CLOSED' } }),
      prisma.complaint.findMany({
        where: { studentId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          department: { select: { name: true } },
          assignedStaff: { select: { name: true } },
          attachments: { select: { id: true, fileName: true, fileUrl: true } },
        },
      }),
    ]);

    return {
      kpis: {
        total,
        submitted,
        underReview,
        assigned,
        inProgress,
        resolved,
        closed,
      },
      recentComplaints,
    };
  }

  static async getAdminDashboard() {
    const [
      total,
      submitted,
      underReview,
      assigned,
      inProgress,
      resolved,
      closed,
      critical,
      totalStudents,
      totalStaff,
      totalDepartments,
      recentComplaints,
      allComplaints,
      departments,
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'SUBMITTED' } }),
      prisma.complaint.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.complaint.count({ where: { status: 'ASSIGNED' } }),
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      prisma.complaint.count({ where: { status: 'CLOSED' } }),
      prisma.complaint.count({ where: { priority: 'CRITICAL', status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.staff.count(),
      prisma.department.count(),
      prisma.complaint.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, name: true, studentId: true } },
          department: { select: { id: true, name: true } },
          assignedStaff: { select: { id: true, name: true } },
        },
      }),
      prisma.complaint.findMany({
        select: {
          status: true,
          priority: true,
          category: true,
          departmentId: true,
          createdAt: true,
        },
      }),
      prisma.department.findMany({
        select: { id: true, name: true },
      }),
    ]);

    // Calculate category distribution
    const categoryMap: Record<string, number> = {};
    const priorityMap: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    const statusMap: Record<string, number> = {
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };
    const deptMap: Record<string, number> = {};

    const deptNameById = new Map(departments.map((d) => [d.id, d.name]));

    allComplaints.forEach((c) => {
      // Category
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
      // Priority
      if (priorityMap[c.priority] !== undefined) {
        priorityMap[c.priority]++;
      } else {
        priorityMap[c.priority] = 1;
      }
      // Status
      if (statusMap[c.status] !== undefined) {
        statusMap[c.status]++;
      } else {
        statusMap[c.status] = 1;
      }
      // Department
      const deptName = c.departmentId ? deptNameById.get(c.departmentId) || 'Other' : 'Unassigned';
      deptMap[deptName] = (deptMap[deptName] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryMap).map(([name, count]) => ({
      name: name.replace(/_/g, ' '),
      category: name,
      count,
    }));

    const priorityDistribution = [
      { name: 'Low', priority: 'LOW', count: priorityMap.LOW || 0, color: '#64748b' },
      { name: 'Medium', priority: 'MEDIUM', count: priorityMap.MEDIUM || 0, color: '#3b82f6' },
      { name: 'High', priority: 'HIGH', count: priorityMap.HIGH || 0, color: '#f97316' },
      { name: 'Critical', priority: 'CRITICAL', count: priorityMap.CRITICAL || 0, color: '#ef4444' },
    ];

    const statusDistribution = [
      { name: 'Submitted', status: 'SUBMITTED', count: statusMap.SUBMITTED || 0, color: '#94a3b8' },
      { name: 'Under Review', status: 'UNDER_REVIEW', count: statusMap.UNDER_REVIEW || 0, color: '#0ea5e9' },
      { name: 'Assigned', status: 'ASSIGNED', count: statusMap.ASSIGNED || 0, color: '#8b5cf6' },
      { name: 'In Progress', status: 'IN_PROGRESS', count: statusMap.IN_PROGRESS || 0, color: '#3b82f6' },
      { name: 'Resolved', status: 'RESOLVED', count: statusMap.RESOLVED || 0, color: '#10b981' },
      { name: 'Closed', status: 'CLOSED', count: statusMap.CLOSED || 0, color: '#475569' },
    ];

    const departmentDistribution = Object.entries(deptMap).map(([name, count]) => ({
      name,
      count,
    }));

    return {
      kpis: {
        total,
        submitted,
        underReview,
        assigned,
        inProgress,
        resolved,
        closed,
        critical,
        totalStudents,
        totalStaff,
        totalDepartments,
      },
      categoryDistribution,
      priorityDistribution,
      statusDistribution,
      departmentDistribution,
      recentComplaints,
    };
  }
}
