import api from './api';

const TOKEN_KEY = 'quod_auth_token';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        return { success: true, user: { email } };
      }
      return { success: false, error: 'Credenciais inválidas' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Falha na autenticação' 
      };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return { success: true, user: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Falha no registro' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token; 
  }
};

export default authService; 