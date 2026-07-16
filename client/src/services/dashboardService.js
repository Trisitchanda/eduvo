import api from './api';

const dashboardService = {
  async getStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  async getChartData() {
    const res = await api.get('/dashboard/chart-data');
    return res.data;
  },
};

export default dashboardService;
