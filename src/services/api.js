import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Snippet API calls
export const snippetAPI = {
  // Get all snippets
  getAll: async (searchQuery = "") => {
    const response = await api.get(
      `/snippets${searchQuery ? `?search=${searchQuery}` : ""}`
    );
    return response.data;
  },

  // Get single snippet
  getOne: async (id) => {
    const response = await api.get(`/snippets/${id}`);
    return response.data;
  },

  // Create snippet
  create: async (snippetData) => {
    const response = await api.post("/snippets", snippetData);
    return response.data;
  },

  // Update snippet
  update: async (id, snippetData) => {
    const response = await api.put(`/snippets/${id}`, snippetData);
    return response.data;
  },

  // Delete snippet
  delete: async (id) => {
    const response = await api.delete(`/snippets/${id}`);
    return response.data;
  },
};

export default api;
