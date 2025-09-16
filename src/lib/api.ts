import axios from "axios";

const getAuthToken = () => localStorage.getItem("authToken");

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    if (config.url?.includes('/cart') || config.url?.includes('/guest-checkout')) {
      const sessionId = localStorage.getItem('cartSessionId');
      console.log(`[API Interceptor] Before request - localStorage cartSessionId: ${sessionId}`);
      if (sessionId) {
        config.headers['X-Session-ID'] = sessionId;
        console.log(`[API Interceptor] Attaching X-Session-ID: ${sessionId} to request for ${config.url}`);
      } else {
        console.log(`[API Interceptor] No session ID found for ${config.url}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Interceptor] Response from:', response.config.url);
    console.log('[API Interceptor] Response headers:', response.headers);

    const newSessionId = response.headers['x-session-id'];
    if (newSessionId) {
      console.log('[API Interceptor] Found x-session-id header:', newSessionId);
      if (newSessionId !== localStorage.getItem('cartSessionId')) {
        console.log('[API Interceptor] New session ID is different. Saving...', newSessionId);
        localStorage.setItem('cartSessionId', newSessionId);
      } else {
        console.log('[API Interceptor] Session ID is the same. No change.');
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;