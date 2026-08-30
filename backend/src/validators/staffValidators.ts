import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().min(2, 'Staff name must be at least 2 characters').max(100, 'Staff name cannot exceed 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  departmentId: z.string().min(1, 'Department ID is required'),
});

export const updateStaffSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  departmentId: z.string().min(1).optional(),
});
