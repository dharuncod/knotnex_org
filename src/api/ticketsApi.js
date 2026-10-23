import apiClient from './apiClient';

export const ticketsApi = {
  async getTickets(params = {}) {
    try {
      const res = await apiClient.get('/tickets', params);
      return res?.data?.items || res?.data?.tickets || res?.data || [];
    } catch (err) {
      console.warn('[ticketsApi] Failed to load tickets from backend:', err.message);
      return [];
    }
  },

  async getTicketById(id) {
    const res = await apiClient.get(`/tickets/${id}`);
    return res?.data || null;
  },

  async createTicket(ticketData) {
    const res = await apiClient.post('/tickets', ticketData);
    return res?.data || res;
  },

  async replyTicket(id, message) {
    const res = await apiClient.post(`/tickets/${id}/reply`, { message });
    return res?.data || res;
  },

  async updateTicketStatus(id, status) {
    const res = await apiClient.patch(`/tickets/${id}/status`, { status });
    return res?.data || res;
  },
};

export default ticketsApi;
