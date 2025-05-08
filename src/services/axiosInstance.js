import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // necessário se estiver usando cookies
});

export const login = async (email, senha) => {
  const response = await API.post('/login', { email, senha });
  return response.data; // { token: "..." }
};

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
