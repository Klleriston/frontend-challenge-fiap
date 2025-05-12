import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quod_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('quod_auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const documentService = {
  validateDocument: (documentData) => {
    return api.post('/documentos/validar', documentData);
  }
};

export const biometricService = {
  validateDigitalBiometry: (imageUrl) => {
    return api.post('/biometria/digital', { imageUrl });
  },
  
  validateDigitalBiometryBase64: (imageBase64) => {
    return api.post('/biometria/digital', { imageBase64 });
  },
  
  validateFacialBiometry: (imageUrl) => {
    return api.post('/biometria/facial', { imageUrl });
  },
  
  validateFacialBiometryBase64: (imageBase64) => {
    return api.post('/biometria/facial', { imageBase64 });
  }
};

export default api; 