import api from './api';

export const doubtsService = {
  async getDoubts(roomId, page = 1, limit = 20, status = 'all') {
    try {
      const response = await api.get(`/rooms/${roomId}/doubts?page=${page}&limit=${limit}&status=${status}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doubts');
    }
  },

  async getDoubt(doubtId) {
    try {
      const response = await api.get(`/doubts/${doubtId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doubt');
    }
  },

  async createDoubt(roomId, doubtData) {
    try {
      const response = await api.post(`/rooms/${roomId}/doubts`, doubtData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create doubt');
    }
  },

  async updateDoubt(doubtId, doubtData) {
    try {
      const response = await api.put(`/doubts/${doubtId}`, doubtData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update doubt');
    }
  },

  async deleteDoubt(doubtId) {
    try {
      const response = await api.delete(`/doubts/${doubtId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete doubt');
    }
  },

  async markAsUrgent(doubtId) {
    try {
      const response = await api.post(`/doubts/${doubtId}/urgent`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark as urgent');
    }
  },

  async unmarkAsUrgent(doubtId) {
    try {
      const response = await api.delete(`/doubts/${doubtId}/urgent`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unmark as urgent');
    }
  },

  async closeDoubt(doubtId) {
    try {
      const response = await api.post(`/doubts/${doubtId}/close`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to close doubt');
    }
  },

  async reopenDoubt(doubtId) {
    try {
      const response = await api.post(`/doubts/${doubtId}/reopen`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reopen doubt');
    }
  },

  async searchDoubts(roomId, query) {
    try {
      const response = await api.get(`/rooms/${roomId}/doubts/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search doubts');
    }
  },
};

