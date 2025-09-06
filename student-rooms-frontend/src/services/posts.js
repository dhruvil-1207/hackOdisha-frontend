import api from './api';

export const postsService = {
  async getPosts(roomId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/rooms/${roomId}/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  },

  async getPost(postId) {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch post');
    }
  },

  async createPost(roomId, postData) {
    try {
      const response = await api.post(`/rooms/${roomId}/posts`, postData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  },

  async updatePost(postId, postData) {
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update post');
    }
  },

  async deletePost(postId) {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete post');
    }
  },

  async likePost(postId) {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like post');
    }
  },

  async unlikePost(postId) {
    try {
      const response = await api.delete(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike post');
    }
  },

  async pinPost(postId) {
    try {
      const response = await api.post(`/posts/${postId}/pin`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to pin post');
    }
  },

  async unpinPost(postId) {
    try {
      const response = await api.delete(`/posts/${postId}/pin`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unpin post');
    }
  },

  async searchPosts(roomId, query) {
    try {
      const response = await api.get(`/rooms/${roomId}/posts/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search posts');
    }
  },
};
