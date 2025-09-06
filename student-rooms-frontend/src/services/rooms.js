import api from './api';

export const roomsService = {
  async getRooms() {
    try {
      const response = await api.get('/rooms');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
  },

  async getRoom(roomId) {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room');
    }
  },

  async createRoom(roomData) {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create room');
    }
  },

  async updateRoom(roomId, roomData) {
    try {
      const response = await api.put(`/rooms/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room');
    }
  },

  async deleteRoom(roomId) {
    try {
      const response = await api.delete(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete room');
    }
  },

  async joinRoom(inviteCode) {
    try {
      const response = await api.post('/rooms/join', { inviteCode });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to join room');
    }
  },

  async leaveRoom(roomId) {
    try {
      const response = await api.post(`/rooms/${roomId}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to leave room');
    }
  },

  async getRoomMembers(roomId) {
    try {
      const response = await api.get(`/rooms/${roomId}/members`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room members');
    }
  },

  async searchRooms(query) {
    try {
      const response = await api.get(`/rooms/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search rooms');
    }
  },
};
