import apiClient from './apiClient';

export const authApi = {
  /**
   * Verifies an SSO one-time code (OTC) issued by KnotNex Mobile App.
   */
  async verifySsoCode(code) {
    const res = await apiClient.post('/auth/sso-verify', { code });
    if (res && res.data) {
      if (res.data.sessionToken) {
        apiClient.setToken(res.data.sessionToken);
      }
      return res.data;
    }
    throw new Error(res?.message || 'Failed to authenticate via SSO');
  },

  /**
   * Retrieves organization associated with current authenticated session.
   */
  async getMyOrganization() {
    try {
      const res = await apiClient.get('/users/me/organization');
      return res?.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Retrieves dashboard analytics stats.
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
   * Retrieves events hosted by this organization.
   */
  async getOrgEvents(orgId) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/events`, { limit: 50 });
      return res?.data?.items || res?.data?.events || [];
    } catch {
      return [];
    }
  },

  /**
   * Retrieves jobs posted by this organization.
   */
  async getOrgJobs(orgId) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/jobs`, { limit: 50 });
      return res?.data?.items || res?.data?.jobs || [];
    } catch {
      return [];
    }
  },

  /**
   * Retrieves schemes managed by this organization.
   */
  async getOrgSchemes(orgId) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/schemes`, { limit: 50 });
      return res?.data?.items || res?.data?.schemes || [];
    } catch {
      return [];
    }
  },

  /**
   * Clears the current session.
   */
  logout() {
    apiClient.setToken(null);
    localStorage.removeItem('knotnex_token');
    localStorage.removeItem('knotnex_user');
    localStorage.removeItem('knotnex_org');
  },
};

export default authApi;
