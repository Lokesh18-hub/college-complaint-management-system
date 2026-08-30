import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../prisma/client';

export class AuthService {
  static async registerStudent(data: {
    name: string;
    studentId: string;
    email: string;
    password: string;
    department: string;
    course: string;
    year: string;
    semester: string;
    phone?: string;
  }) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });
    if (existingEmail) {
      const error: any = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const existingStudentId = await prisma.user.findUnique({
      where: { studentId: data.studentId.trim() },
    });
    if (existingStudentId) {
      const error: any = new Error('An account with this Student ID already exists.');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        studentId: data.studentId.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: 'STUDENT',
        department: data.department.trim(),
        course: data.course.trim(),
        year: data.year.trim(),
        semester: data.semester.trim(),
        phone: data.phone?.trim() || null,
      },
    });

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role as 'STUDENT' | 'ADMIN',
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        course: user.course,
        year: user.year,
        semester: user.semester,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role as 'STUDENT' | 'ADMIN',
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        course: user.course,
        year: user.year,
        semester: user.semester,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string;
      department?: string;
      course?: string;
      year?: string;
      semester?: string;
      avatar?: string;
    }
  ) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.department ? { department: data.department.trim() } : {}),
        ...(data.course ? { course: data.course.trim() } : {}),
        ...(data.year ? { year: data.year.trim() } : {}),
        ...(data.semester ? { semester: data.semester.trim() } : {}),
        ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
      },
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
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  static generateToken(payload: { id: string; email: string; role: 'STUDENT' | 'ADMIN' }): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
  }
}
