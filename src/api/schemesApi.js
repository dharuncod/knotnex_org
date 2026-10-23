import apiClient from './apiClient';

export const schemesApi = {
  /**
   * Fetch paginated schemes for an organization
   */
  async getOrgSchemes(orgId, params = {}) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/schemes`, {
        page: params.page || 1,
        limit: params.limit || 50,
        ...params,
      });
      return res?.data?.items || res?.data?.schemes || res?.data || [];
    } catch {
      const res = await apiClient.get('/schemes', {
        org_id: orgId,
        page: params.page || 1,
        limit: params.limit || 50,
        ...params,
      });
      return res?.data?.items || res?.data?.schemes || res?.data || [];
    }
  },

  /**
   * Fetch single scheme details by ID
   */
  async getSchemeById(schemeId) {
    const res = await apiClient.get(`/schemes/${schemeId}`);
    return res?.data || null;
  },

  /**
   * Create a new welfare scheme
   */
  async createScheme(schemeData) {
    const res = await apiClient.post('/schemes', schemeData);
    return res?.data || res;
  },

  /**
   * Update an existing scheme
   */
  async updateScheme(schemeId, updateData) {
    const res = await apiClient.patch(`/schemes/${schemeId}`, updateData);
    return res?.data || res;
  },

  /**
   * Delete a scheme
   */
  async deleteScheme(schemeId) {
    return await apiClient.delete(`/schemes/${schemeId}`);
  },

  /**
   * Fetch applications for a specific scheme
   */
  async getSchemeApplications(schemeId) {
    try {
      const res = await apiClient.get(`/schemes/${schemeId}/applications`);
      return res?.data?.items || res?.data || [];
    } catch {
      return [];
    }
  },
};

export default schemesApi;
