
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api",
});

// Authentication
export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

// Services
export const getServices = () => API.get("/services");

export const getServiceById = (id) =>
  API.get(`/services/${id}`);

// Locations
export const getLocations = () => API.get("/locations");

export const getServicesByLocation = (locationId) =>
  API.get(`/services/location/${locationId}`);

// Tokens
export const generateToken = (userId, serviceId) =>
  API.post("/tokens", null, {
    params: { userId, serviceId },
  });

export const getTokenById = (id) =>
  API.get(`/tokens/${id}`);

export const getAllTokens = () =>
  API.get("/tokens");

export const getUserTokens = (userId) =>
  API.get(`/tokens/user/${userId}`);

export const cancelToken = (id) =>
  API.put(`/tokens/${id}/cancel`);

export default API;

