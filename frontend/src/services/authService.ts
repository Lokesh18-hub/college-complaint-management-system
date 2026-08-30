import api from './api';
import { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });
    return res.data;
  },

  async register(data: {
    name: string;
    studentId: string;
    email: string;
    password: string;
    department: string;
    course: string;
    year: string;
    semester: string;
    phone?: string;
  }): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/register', data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put<User>('/auth/profile', data);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('ccms_token');
      localStorage.removeItem('ccms_user');
    }
  },
};
