import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../prisma/client';
import { sendError } from '../utils/apiResponse';

export interface AuthUser {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  name: string;
  studentId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication token missing or invalid', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendError(res, 'Authentication token missing', 401);
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { id: string; email: string; role: 'STUDENT' | 'ADMIN' };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        studentId: true,
      },
    });

    if (!user) {
      sendError(res, 'User not found or account deactivated', 401);
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as 'STUDENT' | 'ADMIN',
      name: user.name,
      studentId: user.studentId,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'Token has expired. Please log in again.', 401);
      return;
    }
    if (error.name === 'JsonWebTokenError') {
      sendError(res, 'Invalid authentication token', 401);
      return;
    }
    sendError(res, 'Authentication failed', 401);
  }
};
