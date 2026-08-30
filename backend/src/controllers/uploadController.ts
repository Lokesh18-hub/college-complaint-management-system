import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class UploadController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        sendError(res, 'No file uploaded or file was rejected by filter', 400);
        return;
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      sendSuccess(
        res,
        {
          fileName: req.file.originalname,
          fileUrl,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
        },
        'File uploaded successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }
}
