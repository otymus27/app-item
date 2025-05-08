// src/services/autenticacaoService.js
import axios from 'axios';

const API = 'http://localhost:8080'; // ajuste conforme necessário

export const login = async (credentials) => {
  const response = await axios.post(`${API}/login`, credentials);
  return response.data; // { token, expiresIn }
};
