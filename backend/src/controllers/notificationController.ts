import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class NotificationController {
  static async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const result = await NotificationService.getUserNotifications(req.user.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      await NotificationService.markAsRead(id, req.user.id);
      sendSuccess(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      await NotificationService.markAllAsRead(req.user.id);
      sendSuccess(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }
}
