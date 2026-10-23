import apiClient from './apiClient';

export const jobsApi = {
  /**
   * Fetch paginated jobs for an organization
   */
  async getOrgJobs(orgId, params = {}) {
    try {
      const res = await apiClient.get(`/organizations/${orgId}/jobs`, {
        page: params.page || 1,
        limit: params.limit || 50,
        ...params,
      });
      return res?.data?.items || res?.data?.jobs || res?.data || [];
    } catch {
      const res = await apiClient.get('/jobs', {
        org_id: orgId,
        page: params.page || 1,
        limit: params.limit || 50,
        ...params,
      });
      return res?.data?.items || res?.data?.jobs || res?.data || [];
    }
  },

  /**
   * Fetch single job details by ID
   */
  async getJobById(jobId) {
    const res = await apiClient.get(`/jobs/${jobId}`);
    return res?.data || null;
  },

  /**
   * Create a new job opportunity
   */
  async createJob(jobData) {
    const res = await apiClient.post('/jobs', jobData);
    return res?.data || res;
  },

  /**
   * Update an existing job opportunity
   */
  async updateJob(jobId, updateData) {
    const res = await apiClient.patch(`/jobs/${jobId}`, updateData);
    return res?.data || res;
  },

  /**
   * Delete a job opportunity
   */
  async deleteJob(jobId) {
    return await apiClient.delete(`/jobs/${jobId}`);
  },

  /**
   * Fetch applications for a specific job
   */
  async getJobApplications(jobId) {
    try {
      const res = await apiClient.get(`/jobs/${jobId}/applications`);
      return res?.data?.items || res?.data || [];
    } catch {
      return [];
    }
  },
};

export default jobsApi;
