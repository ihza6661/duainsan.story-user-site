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
    return Promise.reject(error);
  }
);

export default apiClient;