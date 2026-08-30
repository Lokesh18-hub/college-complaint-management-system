import { z } from 'zod';

export const createComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120, 'Title cannot exceed 120 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(15, 'Description must be at least 15 characters').max(2000, 'Description cannot exceed 2000 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location cannot exceed 100 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  attachment: z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
  }).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  comment: z.string().optional(),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const assignComplaintSchema = z.object({
  departmentId: z.string().optional().nullable(),
  assignedStaffId: z.string().optional().nullable(),
  comment: z.string().optional(),
});

export const resolveComplaintSchema = z.object({
  resolutionDetails: z.string().min(5, 'Resolution details must be at least 5 characters').max(1000, 'Resolution details cannot exceed 1000 characters'),
});

export const closeComplaintSchema = z.object({
  feedback: z.string().optional(),
});

export const addCommentSchema = z.object({
  comment: z.string().min(2, 'Comment must be at least 2 characters').max(1000, 'Comment cannot exceed 1000 characters'),
});
