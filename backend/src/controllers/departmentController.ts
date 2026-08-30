import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from '../services/departmentService';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/departmentValidators';
import { sendSuccess } from '../utils/apiResponse';

export class DepartmentController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await DepartmentService.getAllDepartments();
      sendSuccess(res, departments);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const department = await DepartmentService.getDepartmentById(id);
      sendSuccess(res, department);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createDepartmentSchema.parse(req.body);
      const department = await DepartmentService.createDepartment(validated);
      sendSuccess(res, department, 'Department created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updateDepartmentSchema.parse(req.body);
      const department = await DepartmentService.updateDepartment(id, validated);
      sendSuccess(res, department, 'Department updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await DepartmentService.deleteDepartment(id);
      sendSuccess(res, null, 'Department deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
