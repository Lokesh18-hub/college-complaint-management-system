import { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaintService';
import {
  createComplaintSchema,
  updateStatusSchema,
  updatePrioritySchema,
  assignComplaintSchema,
  resolveComplaintSchema,
  closeComplaintSchema,
  addCommentSchema,
} from '../validators/complaintValidators';
import { sendSuccess, sendPaginated, sendError } from '../utils/apiResponse';

export class ComplaintController {
  static async createComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const validated = createComplaintSchema.parse(req.body);
      const complaint = await ComplaintService.createComplaint(req.user.id, validated);
      sendSuccess(res, complaint, 'Complaint submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const {
        status,
        priority,
        category,
        departmentId,
        search,
        studentId,
        startDate,
        endDate,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      const result = await ComplaintService.getComplaints(
        {
          status: status as string,
          priority: priority as string,
          category: category as string,
          departmentId: departmentId as string,
          search: search as string,
          studentId: studentId as string,
          startDate: startDate as string,
          endDate: endDate as string,
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc',
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : 10,
        },
        req.user.role,
        req.user.id
      );

      sendPaginated(res, result.complaints, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getComplaintById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const complaint = await ComplaintService.getComplaintById(id, req.user.role, req.user.id);
      sendSuccess(res, complaint);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const validated = updateStatusSchema.parse(req.body);
      const updated = await ComplaintService.updateStatus(
        id,
        validated.status,
        validated.comment,
        req.user.id,
        req.user.name
      );
      sendSuccess(res, updated, `Status updated to ${validated.status}`);
    } catch (error) {
      next(error);
    }
  }

  static async updatePriority(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const validated = updatePrioritySchema.parse(req.body);
      const updated = await ComplaintService.updatePriority(
        id,
        validated.priority,
        req.user.id,
        req.user.name
      );
      sendSuccess(res, updated, `Priority updated to ${validated.priority}`);
    } catch (error) {
      next(error);
    }
  }

  static async assignComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const validated = assignComplaintSchema.parse(req.body);
      const updated = await ComplaintService.assignComplaint(
        id,
        validated.departmentId,
        validated.assignedStaffId,
        validated.comment,
        req.user.id,
        req.user.name
      );
      sendSuccess(res, updated, 'Complaint assignment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async resolveComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const validated = resolveComplaintSchema.parse(req.body);
      const updated = await ComplaintService.resolveComplaint(
        id,
        validated.resolutionDetails,
        req.user.id,
        req.user.name
      );
      sendSuccess(res, updated, 'Complaint resolved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async closeComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const validated = closeComplaintSchema.parse(req.body);
      const updated = await ComplaintService.closeComplaint(
        id,
        validated.feedback,
        req.user.id,
        req.user.role,
        req.user.name
      );
      sendSuccess(res, updated, 'Complaint closed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const validated = addCommentSchema.parse(req.body);
      const update = await ComplaintService.addComment(
        id,
        validated.comment,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, update, 'Comment added to timeline', 201);
    } catch (error) {
      next(error);
    }
  }

  static async addAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const id = req.params.id as string;
      const { fileName, fileUrl, fileType, fileSize } = req.body;
      if (!fileName || !fileUrl) {
        sendError(res, 'File name and file URL are required', 400);
        return;
      }
      const attachment = await ComplaintService.addAttachment(
        id,
        { fileName, fileUrl, fileType: fileType || 'image/jpeg', fileSize: fileSize || 0 },
        req.user.id,
        req.user.role
      );
      sendSuccess(res, attachment, 'Attachment added', 201);
    } catch (error) {
      next(error);
    }
  }
}
