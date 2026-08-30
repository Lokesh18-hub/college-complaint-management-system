import { Request, Response, NextFunction } from 'express';
import { StaffService } from '../services/staffService';
import { createStaffSchema, updateStaffSchema } from '../validators/staffValidators';
import { sendSuccess } from '../utils/apiResponse';

export class StaffController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const departmentId = req.query.departmentId as string | undefined;
      const staff = await StaffService.getAllStaff(departmentId);
      sendSuccess(res, staff);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const staff = await StaffService.getStaffById(id);
      sendSuccess(res, staff);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createStaffSchema.parse(req.body);
      const staff = await StaffService.createStaff(validated);
      sendSuccess(res, staff, 'Staff member added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updateStaffSchema.parse(req.body);
      const staff = await StaffService.updateStaff(id, validated);
      sendSuccess(res, staff, 'Staff member updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await StaffService.deleteStaff(id);
      sendSuccess(res, null, 'Staff member removed successfully');
    } catch (error) {
      next(error);
    }
  }
}
