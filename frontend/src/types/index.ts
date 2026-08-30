export type Role = 'STUDENT' | 'ADMIN';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Status =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export interface User {
  id: string;
  name: string;
  studentId?: string | null;
  email: string;
  phone?: string | null;
  department?: string | null;
  course?: string | null;
  year?: string | null;
  semester?: string | null;
  role: Role;
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt?: string;
  staff?: Staff[];
  _count?: {
    complaints: number;
    staff: number;
  };
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  departmentId: string;
  department?: {
    id: string;
    name: string;
  };
  _count?: {
    complaints: number;
  };
  createdAt?: string;
}

export interface Attachment {
  id: string;
  complaintId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    role: Role;
  };
  comment: string;
  status?: string | null;
  createdAt: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    email: string;
    studentId?: string;
    department?: string;
    course?: string;
    year?: string;
    semester?: string;
    phone?: string;
  };
  title: string;
  category: string;
  description: string;
  location: string;
  priority: Priority;
  status: Status;
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
    description?: string;
  } | null;
  assignedStaffId?: string | null;
  assignedStaff?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  resolutionDetails?: string | null;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  updates?: ComplaintUpdate[];
  _count?: {
    updates: number;
    attachments: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  link?: string | null;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudentDashboardData {
  kpis: {
    total: number;
    submitted: number;
    underReview: number;
    assigned: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  recentComplaints: Complaint[];
}

export interface AdminDashboardData {
  kpis: {
    total: number;
    submitted: number;
    underReview: number;
    assigned: number;
    inProgress: number;
    resolved: number;
    closed: number;
    critical: number;
    totalStudents: number;
    totalStaff: number;
    totalDepartments: number;
  };
  categoryDistribution: { name: string; category: string; count: number }[];
  priorityDistribution: { name: string; priority: string; count: number; color: string }[];
  statusDistribution: { name: string; status: string; count: number; color: string }[];
  departmentDistribution: { name: string; count: number }[];
  recentComplaints: Complaint[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
  errors?: { field?: string; message: string }[];
}
