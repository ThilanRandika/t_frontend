import axios from "axios";

const USER_SERVICE = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:3001";
const PRODUCT_SERVICE = import.meta.env.VITE_PRODUCT_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE = import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:3003";

// Helper to inject auth header
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── User Service API Client ──────────────────────────────────────────────────
export const userApi = {
  register: (data) => axios.post(`${USER_SERVICE}/auth/register`, data),
  login: (data) => axios.post(`${USER_SERVICE}/auth/login`, data),
  getProfile: () =>
    axios.get(`${USER_SERVICE}/auth/profile`, { headers: authHeader() }),
  getFullProfile: () =>
    axios.get(`${USER_SERVICE}/auth/profile/full`, { headers: authHeader() }),
  updateProfile: (data) =>
    axios.put(`${USER_SERVICE}/auth/profile`, data, { headers: authHeader() }),
  verify: () =>
    axios.get(`${USER_SERVICE}/auth/verify`, { headers: authHeader() }),
  getAllUsers: () => 
    axios.get(`${USER_SERVICE}/auth/users`, { headers: authHeader() }),
  deactivateUser: (id) =>
    axios.put(`${USER_SERVICE}/auth/users/${id}/deactivate`, {}, { headers: authHeader() }),
  toggleWishlist: (data) =>
    axios.put(`${USER_SERVICE}/auth/profile/wishlist`, data, { headers: authHeader() }),
  health: () => axios.get(`${USER_SERVICE}/health`),
};

// ── Product Service API Client ───────────────────────────────────────────────
export const productApi = {
  getAll: (params = {}) => axios.get(`${PRODUCT_SERVICE}/products`, { params }),
  getById: (id) => axios.get(`${PRODUCT_SERVICE}/products/${id}`),
  create: (data) =>
    axios.post(`${PRODUCT_SERVICE}/products`, data, { headers: authHeader() }),
  update: (id, data) =>
    axios.put(`${PRODUCT_SERVICE}/products/${id}`, data, {
      headers: authHeader(),
    }),
  delete: (id) =>
    axios.delete(`${PRODUCT_SERVICE}/products/${id}`, {
      headers: authHeader(),
    }),
  health: () => axios.get(`${PRODUCT_SERVICE}/health`),
};

// ── Order Service API Client ─────────────────────────────────────────────────
export const orderApi = {
  create: (data) =>
    axios.post(`${ORDER_SERVICE}/orders`, data, { headers: authHeader() }),
  getMyOrders: () =>
    axios.get(`${ORDER_SERVICE}/orders`, { headers: authHeader() }),
  getById: (id) =>
    axios.get(`${ORDER_SERVICE}/orders/${id}`, { headers: authHeader() }),
  updateStatus: (id, status) =>
    axios.put(
      `${ORDER_SERVICE}/orders/${id}/status`,
      { status },
      { headers: authHeader() },
    ),
  getAllOrders: (params = {}) => 
    axios.get(`${ORDER_SERVICE}/orders/all`, { headers: authHeader(), params }),
  health: () => axios.get(`${ORDER_SERVICE}/health`),
};

// ── Notification Service API Client ──────────────────────────────────────────
const NOTIFICATION_SERVICE = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:3004";

export const notificationApi = {
  sendOrderPlaced: (data) => axios.post(`${NOTIFICATION_SERVICE}/api/notifications/order-placed`, data),
  getHistory: () => axios.get(`${NOTIFICATION_SERVICE}/api/notifications/my-history`, { 
    headers: { 
      ...authHeader(), 
      'Cache-Control': 'no-cache, no-store, must-revalidate', 
      'Pragma': 'no-cache', 
      'Expires': '0' 
    } 
  }),
  getSystemLogs: (params = {}) => axios.get(`${NOTIFICATION_SERVICE}/api/notifications/system-logs`, {
    headers: authHeader(),
    params
  })
};
