import api from './api';
import { Staff } from '../types';

export const staffService = {
  async getAll(departmentId?: string): Promise<Staff[]> {
    const res = await api.get<Staff[]>('/staff', { departmentId });
    return res.data;
  },

  async getById(id: string): Promise<Staff> {
    const res = await api.get<Staff>(`/staff/${id}`);
    return res.data;
  },

  async create(data: { name: string; email: string; phone?: string; departmentId: string }): Promise<Staff> {
    const res = await api.post<Staff>('/staff', data);
    return res.data;
  },

  async update(id: string, data: { name?: string; email?: string; phone?: string; departmentId?: string }): Promise<Staff> {
    const res = await api.put<Staff>(`/staff/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/staff/${id}`);
  },
};
