import apiClient from './apiClient';

export const registrationsApi = {
  /**
   * Fetch all registrations for a specific event
   */
  async getEventRegistrations(eventId) {
    const res = await apiClient.get(`/registrations/event/${eventId}`);
    return res?.data || [];
  },

  /**
   * Fetch all registrations across the organization
   */
  async getOrgRegistrations(orgId, params = {}) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/registrations`, {
        page: params.page || 1,
        limit: params.limit || 50,
        ...params,
      });
      return res?.data?.items || res?.data || [];
    } catch {
      try {
        const fallbackRes = await apiClient.get('/registrations', {
          org_id: orgId,
          orgId: orgId,
          page: params.page || 1,
          limit: params.limit || 50,
          ...params,
        });
        return fallbackRes?.data?.items || fallbackRes?.data || [];
      } catch {
        return [];
      }
    }
  },

  /**
   * Update registration status (confirmed, attended, cancelled)
   */
  async updateStatus(registrationId, status) {
    const res = await apiClient.patch(`/registrations/${registrationId}/status`, { status });
    return res?.data || res;
  },

  /**
   * Check in attendee using QR Code hash
   */
  async checkInByQr(qrCodeHash) {
    const res = await apiClient.post('/registrations/check-in', { qrCodeHash });
    return res?.data || res;
  },

  /**
   * Get registration entry pass and QR payload
   */
  async getQrPass(registrationId) {
    const res = await apiClient.get(`/registrations/${registrationId}/qr-pass`);
    return res?.data || null;
  },
};

export default registrationsApi;
