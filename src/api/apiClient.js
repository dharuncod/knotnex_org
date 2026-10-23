/**
 * KnotNex Organization Platform — API Client
 * Connects to the KnotNex Node.js backend.
 */

const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.'));

const PRIMARY_API_URL = isLocal
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1')
  : (import.meta.env.VITE_PROD_API_URL || 'https://knotnex-backend-389663780266.asia-south1.run.app/api/v1');

const FALLBACK_API_URL =
  import.meta.env.VITE_PROD_API_URL ||
  'https://knotnex-backend-389663780266.asia-south1.run.app/api/v1';

let currentBaseUrl = PRIMARY_API_URL;

export const apiClient = {
  getBaseUrl() {
    return currentBaseUrl;
  },

  setBaseUrl(url) {
    currentBaseUrl = url;
  },

  getToken() {
    try {
      return localStorage.getItem('knotnex_token') || '';
    } catch {
      return '';
    }
  },

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem('knotnex_token', token);
      } else {
        localStorage.removeItem('knotnex_token');
      }
    } catch (e) {
      console.error('[apiClient] Failed to store token', e);
    }
  },

  async request(endpoint, options = {}) {
    const buildUrl = (base) => endpoint.startsWith('http') ? endpoint : `${base}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      // Local development mock token fallback for backend auth middleware
      headers.Authorization = 'Bearer mock_organization';
    }

    // Try currentBaseUrl first
    try {
      const response = await fetch(buildUrl(currentBaseUrl), {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMsg = data && data.message ? data.message : `HTTP ${response.status}`;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (primaryErr) {
      // If primary failed due to network unreachable on localhost, seamlessly try FALLBACK_API_URL
      if (currentBaseUrl !== FALLBACK_API_URL && !endpoint.startsWith('http')) {
        try {
          console.info(`[apiClient] ${currentBaseUrl} unreachable, falling back to ${FALLBACK_API_URL}`);
          const fallbackResp = await fetch(buildUrl(FALLBACK_API_URL), {
            ...options,
            headers,
          });

          const contentType = fallbackResp.headers.get('content-type');
          let data = null;
          if (contentType && contentType.includes('application/json')) {
            data = await fallbackResp.json();
          } else {
            data = await fallbackResp.text();
          }

          if (fallbackResp.ok) {
            // Persist working base URL for subsequent calls
            currentBaseUrl = FALLBACK_API_URL;
            return data;
          }
        } catch {
          // Keep original error
        }
      }

      console.warn(`[apiClient] Request to ${endpoint} failed:`, primaryErr.message);
      throw primaryErr;
    }
  },

  get(endpoint, queryParams = {}) {
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

export default apiClient;
