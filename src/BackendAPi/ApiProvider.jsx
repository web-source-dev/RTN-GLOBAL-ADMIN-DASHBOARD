import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://backend.mydomain.local:5000",
  // baseURL: "https://api.rtnglobal.site",
  withCredentials: true, // This ensures cookies are sent with requests
});

// Create a flag to prevent redirect loops
let isRedirecting = false;

// Add a request interceptor to handle authentication
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;
    
    // Check if request method is NOT GET before redirecting
    if (config && config.method !== "get" && !isRedirecting) {
      if (response) {
        const { status } = response;

        // Handle 401 Unauthorized errors (session expired or not authenticated)
        if (status === 401) {
          isRedirecting = true;
          if (!window.location.pathname.includes('/error/session-expired')) {
            window.location.href = '/error/session-expired';
          }
          return Promise.reject(error);
        }

        // Handle 500 and other server errors
        if (status >= 500) {
          isRedirecting = true;
          if (!window.location.pathname.includes('/error/server-error')) {
            window.location.href = '/error/server-error';
          }
          return Promise.reject(error);
        }
      }

      // Handle network errors or when response is not available
      if (!response && !window.location.pathname.includes('/error/server-error')) {
        isRedirecting = true;
        window.location.href = '/error/server-error';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
