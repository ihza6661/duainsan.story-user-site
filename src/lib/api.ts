import axios from "axios";

const getAuthToken = () => localStorage.getItem("authToken");

const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


// --- Request Interceptor ---
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always attach X-Session-ID for cart and guest-checkout related requests
    const sessionAwareEndpoints = ['/cart', '/guest-checkout', '/shipping-cost'];
    if (config.url && sessionAwareEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      const sessionId = localStorage.getItem('cartSessionId');
      if (sessionId) {
        config.headers['X-Session-ID'] = sessionId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response) => {
    const newSessionId = response.headers['x-session-id'];
    if (newSessionId) {
      if (newSessionId !== localStorage.getItem('cartSessionId')) {
        localStorage.setItem('cartSessionId', newSessionId);
      }
    }
    return response;
  },
  (error) => {
    // Auto-logout on 401 Unauthorized (invalid/expired token)
    if (error.response?.status === 401) {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login page with return URL
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;