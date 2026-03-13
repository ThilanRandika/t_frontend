import axios from "axios";

const USER_SERVICE =
  import.meta.env.VITE_USER_SERVICE_URL ||
  "http://ecommerce-lb-2011253033.ap-south-1.elb.amazonaws.com:3001";
const PRODUCT_SERVICE =
  import.meta.env.VITE_PRODUCT_SERVICE_URL ||
  "http://ecommerce-lb-2011253033.ap-south-1.elb.amazonaws.com:3002";
const ORDER_SERVICE =
  import.meta.env.VITE_ORDER_SERVICE_URL ||
  "http://ecommerce-lb-2011253033.ap-south-1.elb.amazonaws.com:3003";

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
  updateProfile: (data) =>
    axios.put(`${USER_SERVICE}/auth/profile`, data, { headers: authHeader() }),
  verify: () =>
    axios.get(`${USER_SERVICE}/auth/verify`, { headers: authHeader() }),
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
  health: () => axios.get(`${ORDER_SERVICE}/health`),
};
