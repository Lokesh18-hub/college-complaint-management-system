import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class DashboardController {
  static async getStudentDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const data = await DashboardService.getStudentDashboard(req.user.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getAdminDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getAdminDashboard();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
