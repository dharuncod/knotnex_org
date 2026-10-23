import apiClient from './apiClient';

export const notificationsApi = {
  async getNotifications(params = {}) {
    try {
      const res = await apiClient.get('/notifications', params);
      return res?.data?.items || res?.data?.notifications || res?.data || [];
    } catch (err) {
      console.warn('[notificationsApi] Failed to load notifications:', err.message);
      return [];
    }
  },

  async getUnreadCount() {
    try {
      const res = await apiClient.get('/notifications/unread-count');
      return res?.data?.count || 0;
    } catch {
      return 0;
    }
  },

  async markAsRead(id) {
    return await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return await apiClient.patch('/notifications/read-all');
  },
};

export default notificationsApi;
