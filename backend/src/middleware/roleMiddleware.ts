import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const requireRole = (...allowedRoles: ('STUDENT' | 'ADMIN')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized. Please login first.', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'Forbidden. You do not have permission to perform this action.', 403);
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');
export const requireStudent = requireRole('STUDENT');
