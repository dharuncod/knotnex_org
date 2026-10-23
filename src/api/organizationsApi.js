import apiClient from './apiClient';

export const organizationsApi = {
  /**
   * Fetch authenticated user's organization
   */
  async getMyOrganization() {
    try {
      const res = await apiClient.get('/users/me/organization');
      if (res?.data && res.data.id) {
        return res.data;
      }
    } catch {
      // ignore
    }

    try {
      const res = await apiClient.get('/organizations', { limit: 1 });
      const orgs = res?.data?.items || res?.data || [];
      if (orgs.length > 0) {
        return orgs[0];
      }
    } catch (e) {
      console.warn('[organizationsApi] Error fetching organization list:', e.message);
    }
    return null;
  },

  /**
   * Fetch dashboard analytics for an organization
   */
  async getOrgDashboard(orgId) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/dashboard`);
      return res?.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Update organization profile
   */
  async updateOrg(orgId, updateData) {
    const res = await apiClient.patch(`/organizations/${orgId}`, updateData);
    return res?.data || res;
  },

  /**
   * Fetch reviews for an organization
   */
  async getReviews(orgId) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/reviews`);
      return res?.data || [];
    } catch {
      return [];
    }
  },
};

export default organizationsApi;
