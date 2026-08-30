import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/authValidators';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.registerStudent(validated);
      sendSuccess(res, result, 'Student registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated.email, validated.password);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const user = await AuthService.getMe(req.user.id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const validated = updateProfileSchema.parse(req.body);
      const updated = await AuthService.updateProfile(req.user.id, validated);
      sendSuccess(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    // Client discards token, server returns 200
    sendSuccess(res, null, 'Logged out successfully');
  }
}
