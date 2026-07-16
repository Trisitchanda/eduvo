import api from './api';

const STORAGE_KEY = 'eduvo_user';

const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    const user = this.getCurrentUser();
    return user?.token || null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;
