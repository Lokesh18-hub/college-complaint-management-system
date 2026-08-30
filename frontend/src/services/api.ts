const getApiBase = (): string => {
  let envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!envUrl || envUrl === '/api') return '/api';

  // If accidentally prefixed or duplicated (e.g. /apihttps://... or https://...https://...)
  if (envUrl.includes('http')) {
    const lastHttp = envUrl.lastIndexOf('http');
    envUrl = envUrl.substring(lastHttp);
  }

  // Remove trailing slashes
  const cleanUrl = envUrl.replace(/\/+$/, '');
  // If it already ends with /api, use it as is; otherwise append /api
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE = getApiBase();

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('ccms_token');
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data: T; message?: string; pagination?: any }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('ccms_token');
          localStorage.removeItem('ccms_user');
          if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
            window.location.href = '/login';
          }
        }

        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const errorMessage =
          data.message ||
          (data.errors && data.errors.map((e: any) => e.message).join(', ')) ||
          (response.status === 502 || response.status === 503 || response.status === 504 || response.status === 500
            ? isDev
              ? 'Unable to connect to backend server. Please verify backend is running on port 5000.'
              : 'Backend server is waking up from sleep or unavailable. Please wait 30 seconds and try again.'
            : 'An error occurred with the request');

        const error: any = new Error(errorMessage);
        error.status = response.status;
        error.errors = data.errors;
        throw error;
      }

      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message?.toLowerCase().includes('fetch')) {
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        throw new Error(
          isDev
            ? 'Unable to connect to backend server. Please verify backend is running on port 5000.'
            : 'Unable to reach backend service (Render free instance may be spinning up). Please retry in 30 seconds.'
        );
      }
      throw error;
    }
  }

  get<T = any>(endpoint: string, params?: Record<string, any>) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
