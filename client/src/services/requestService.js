import api from './api';

const requestService = {
  // Public
  async createRequest(data) {
    const res = await api.post('/demo-requests', data);
    return res.data;
  },

  // Protected
  async getRequests(params = {}) {
    const res = await api.get('/demo-requests', { params });
    return res.data;
  },

  async getRequestById(id) {
    const res = await api.get(`/demo-requests/${id}`);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await api.patch(`/demo-requests/${id}/status`, { status });
    return res.data;
  },

  async assignRequest(id, assigned_to) {
    const res = await api.patch(`/demo-requests/${id}/assign`, { assigned_to });
    return res.data;
  },

  async scheduleDemo(id, datetime) {
    const res = await api.patch(`/demo-requests/${id}/schedule`, { datetime });
    return res.data;
  },

  async addNote(id, note, nextFollowupDate) {
    const payload = { note };
    if (nextFollowupDate) {
      payload.next_followup_date = nextFollowupDate;
    }
    const res = await api.post(`/demo-requests/${id}/notes`, payload);
    return res.data;
  },
};

export default requestService;
