import api from './api';
import { StudentDashboardData, AdminDashboardData } from '../types';

export const dashboardService = {
  async getStudentDashboard(): Promise<StudentDashboardData> {
    const res = await api.get<StudentDashboardData>('/dashboard/student');
    return res.data;
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const res = await api.get<AdminDashboardData>('/dashboard/admin');
    return res.data;
  },
};
