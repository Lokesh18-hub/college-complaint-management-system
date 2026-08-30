import api from './api';
import { Notification } from '../types';

export const notificationService = {
  async getMyNotifications(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const res = await api.get<{ notifications: Notification[]; unreadCount: number }>('/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },
};
