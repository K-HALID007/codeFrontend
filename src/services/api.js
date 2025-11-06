import axios from "axios";

// Use environment variables, with fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

console.log("🌐 API URL:", API_URL);
console.log("📡 Socket URL:", SOCKET_URL);
console.log("🔧 Environment:", process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error Details:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.statusText);
    console.error("Data:", error.response?.data);
    console.error("Request:", {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
    });
    return Promise.reject(error);
  }
);

// Snippet API calls
export const snippetAPI = {
  // Get all snippets
  getAll: async (searchQuery = "") => {
    try {
      const response = await api.get(
        `/snippets${searchQuery ? `?search=${searchQuery}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching snippets:", error.message);
      throw error;
    }
  },

  // Get single snippet
  getOne: async (id) => {
    try {
      const response = await api.get(`/snippets/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching snippet:", error.message);
      throw error;
    }
  },

  // Create snippet
  create: async (snippetData) => {
    try {
      console.log("📤 Sending snippet data:", snippetData);

      const payload = {
        name: snippetData.name,
      };

      console.log("📦 Final payload:", payload);

      const response = await api.post("/snippets", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating snippet:", error.message);
      throw error;
    }
  },

  // Update snippet
  update: async (id, snippetData) => {
    try {
      console.log("📤 Sending update data:", snippetData);
      const response = await api.put(`/snippets/${id}`, snippetData);
      return response.data;
    } catch (error) {
      console.error("Error updating snippet:", error.message);
      throw error;
    }
  },

  // Delete snippet
  delete: async (id) => {
    try {
      const response = await api.delete(`/snippets/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting snippet:", error.message);
      throw error;
    }
  },
};

export { SOCKET_URL };
export default api;
