import api from './api';

export const commentsService = {
  async getComments(parentId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/comments/${parentId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  async createComment(commentData) {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create comment');
    }
  },

  async updateComment(commentId, commentData) {
    try {
      const response = await api.put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update comment');
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  },

  async likeComment(commentId) {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like comment');
    }
  },

  async unlikeComment(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike comment');
    }
  },

  async markAsSolution(commentId) {
    try {
      const response = await api.post(`/comments/${commentId}/solution`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark as solution');
    }
  },

  async unmarkAsSolution(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}/solution`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unmark as solution');
    }
  },
};
