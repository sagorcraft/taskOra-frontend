import axios from "axios";

// Single place to configure the backend connection once the demo AuthContext is replaced with real requests.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});
