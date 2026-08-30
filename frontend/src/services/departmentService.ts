import api from './api';
import { Department } from '../types';

export const departmentService = {
  async getAll(): Promise<Department[]> {
    const res = await api.get<Department[]>('/departments');
    return res.data;
  },

  async getById(id: string): Promise<Department> {
    const res = await api.get<Department>(`/departments/${id}`);
    return res.data;
  },

  async create(data: { name: string; description?: string }): Promise<Department> {
    const res = await api.post<Department>('/departments', data);
    return res.data;
  },

  async update(id: string, data: { name?: string; description?: string }): Promise<Department> {
    const res = await api.put<Department>(`/departments/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  },
};
