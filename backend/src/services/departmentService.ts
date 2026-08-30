import prisma from '../prisma/client';

export class DepartmentService {
  static async getAllDepartments() {
    return await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        staff: {
          select: { id: true, name: true, email: true, phone: true },
        },
        _count: {
          select: { complaints: true, staff: true },
        },
      },
    });
  }

  static async getDepartmentById(id: string) {
    const dept = await prisma.department.findUnique({
      where: { id },
      include: {
        staff: true,
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
          select: { complaints: true, staff: true },
        },
      },
    });

    if (!dept) {
      const error: any = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    return dept;
  }

  static async createDepartment(data: { name: string; description?: string }) {
    const existing = await prisma.department.findUnique({
      where: { name: data.name.trim() },
    });

    if (existing) {
      const error: any = new Error('Department with this name already exists');
      error.statusCode = 409;
      throw error;
    }

    return await prisma.department.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
      },
    });
  }

  static async updateDepartment(id: string, data: { name?: string; description?: string }) {
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    if (data.name && data.name.trim() !== existing.name) {
      const duplicate = await prisma.department.findUnique({
        where: { name: data.name.trim() },
      });
      if (duplicate) {
        const error: any = new Error('Department with this name already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    return await prisma.department.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.description !== undefined ? { description: data.description.trim() } : {}),
      },
    });
  }

  static async deleteDepartment(id: string) {
    const existing = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: { select: { complaints: true } },
      },
    });

    if (!existing) {
      const error: any = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    // Safety check: Prevent deletion if active complaints linked
    const activeComplaintsCount = await prisma.complaint.count({
      where: {
        departmentId: id,
        status: { in: ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW'] },
      },
    });

    if (activeComplaintsCount > 0) {
      const error: any = new Error(
        `Cannot delete department because it is assigned to ${activeComplaintsCount} active complaints. Reassign them first.`
      );
      error.statusCode = 400;
      throw error;
    }

    return await prisma.department.delete({
      where: { id },
    });
  }
}
