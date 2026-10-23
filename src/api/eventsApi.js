import apiClient from './apiClient';

export const eventsApi = {
  /**
   * Fetch paginated events for an organization
   */
  async getOrgEvents(orgId, params = {}) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/events`, {
        page: params.page || 1,
        limit: params.limit || 50,
        ...params,
      });
      return res?.data?.items || res?.data?.events || res?.data || [];
    } catch {
      const res = await apiClient.get('/events', {
        org_id: orgId,
        page: params.page || 1,
        limit: params.limit || 50,
        ...params,
      });
      return res?.data?.items || res?.data?.events || res?.data || [];
    }
  },

  /**
   * Fetch single event details by ID
   */
  async getEventById(eventId) {
    const res = await apiClient.get(`/events/${eventId}`);
    return res?.data || null;
  },

  /**
   * Fetch real registrations / attendees for an event
   */
  async getEventAttendees(eventId) {
    try {
      const res = await apiClient.get(`/registrations/event/${eventId}`);
      return res?.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Create a new event
   */
  async createEvent(eventData) {
    const res = await apiClient.post('/events', eventData);
    return res?.data || res;
  },

  /**
   * Update an existing event
   */
  async updateEvent(eventId, updateData) {
    const res = await apiClient.patch(`/events/${eventId}`, updateData);
    return res?.data || res;
  },

  /**
   * Delete an event
   */
  async deleteEvent(eventId) {
    return await apiClient.delete(`/events/${eventId}`);
  },
};

export default eventsApi;
