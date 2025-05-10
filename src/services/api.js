import axios from 'axios';

// Cria instância do Axios com base na URL do .env ou localhost como fallback
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000, // 10 segundos
  withCredentials: true,
});

/**
 * Define ou remove o token JWT no cabeçalho Authorization do Axios.
 * @param {string|null} token 
 */
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (import.meta.env.DEV) console.log("Token definido:", token);
  } else {
    delete API.defaults.headers.common['Authorization'];
    if (import.meta.env.DEV) console.log("Token removido");
  }
};


export { API };
