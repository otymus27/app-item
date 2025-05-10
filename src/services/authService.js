// import API, { setAuthToken } from './api';
import { API, setAuthToken } from './api'; // ✅ Correto: API é uma named export
import { parseAxiosError } from './parseAxiosError';

/**
 * Faz login e define o token de autenticação
 */
export const login = async (login, senha) => {
  try {
    const response = await API.post('/login', { login, senha });
    const token = response.data.accessToken;

    if (!token) throw new Error('Token de acesso não retornado pela API');

    setAuthToken(token);
    if (import.meta.env.DEV) console.log("Resposta do login:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(parseAxiosError(error));
  }
};

/**
 * Busca os dados do usuário autenticado
 */
export const fetchUserData = async () => {
  try {
    const response = await API.get('/usuarios/logado');
    if (import.meta.env.DEV) console.log("Resposta do fetchUserData:", response.data);
    return Array.isArray(response.data) ? response.data[0] : response.data;
  } catch (error) {
    if (import.meta.env.DEV) console.error("Erro no fetchUserData:", error);
    throw new Error(parseAxiosError(error));
  }
};