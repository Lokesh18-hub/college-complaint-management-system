import api from './api';
import { Complaint, ComplaintUpdate, Attachment, Pagination } from '../types';

export interface GetComplaintsParams {
  status?: string;
  priority?: string;
  category?: string;
  departmentId?: string;
  studentId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const complaintService = {
  async getComplaints(params: GetComplaintsParams = {}): Promise<{ complaints: Complaint[]; pagination: Pagination }> {
    const res = await api.get<Complaint[]>('/complaints', params);
    return {
      complaints: res.data,
      pagination: res.pagination || { page: 1, limit: 10, total: res.data.length, totalPages: 1 },
    };
  },

  async getComplaintById(id: string): Promise<Complaint> {
    const res = await api.get<Complaint>(`/complaints/${id}`);
    return res.data;
  },

  async createComplaint(data: {
    title: string;
    category: string;
    description: string;
    location: string;
    priority?: string;
    attachment?: {
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    };
  }): Promise<Complaint> {
    const res = await api.post<Complaint>('/complaints', data);
    return res.data;
  },

  async updateStatus(id: string, status: string, comment?: string): Promise<Complaint> {
    const res = await api.patch<Complaint>(`/complaints/${id}/status`, { status, comment });
    return res.data;
  },

  async updatePriority(id: string, priority: string): Promise<Complaint> {
    const res = await api.patch<Complaint>(`/complaints/${id}/priority`, { priority });
    return res.data;
  },

  async assignComplaint(
    id: string,
    departmentId?: string | null,
    assignedStaffId?: string | null,
    comment?: string
  ): Promise<Complaint> {
    const res = await api.post<Complaint>(`/complaints/${id}/assign`, {
      departmentId,
      assignedStaffId,
      comment,
    });
    return res.data;
  },

  async resolveComplaint(id: string, resolutionDetails: string): Promise<Complaint> {
    const res = await api.post<Complaint>(`/complaints/${id}/resolve`, { resolutionDetails });
    return res.data;
  },

  async closeComplaint(id: string, feedback?: string): Promise<Complaint> {
    const res = await api.post<Complaint>(`/complaints/${id}/close`, { feedback });
    return res.data;
  },

  async addComment(id: string, comment: string): Promise<ComplaintUpdate> {
    const res = await api.post<ComplaintUpdate>(`/complaints/${id}/updates`, { comment });
    return res.data;
  },

  async addAttachment(
    id: string,
    attachment: { fileName: string; fileUrl: string; fileType: string; fileSize: number }
  ): Promise<Attachment> {
    const res = await api.post<Attachment>(`/complaints/${id}/attachments`, attachment);
    return res.data;
  },
};
