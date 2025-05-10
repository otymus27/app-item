// src/hooks/useAuth.jsx
import { useState, useEffect, useCallback } from 'react';
import { login, fetchUserData } from '../services/authService';
import { setAuthToken } from '../services/api';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthAndFetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setError(null);
      setAuthToken(token);
      try {
        const userData = await fetchUserData();
        setIsLoggedIn(true);
        setUser(userData);
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
        setError(err.message || 'Erro ao obter dados do utilizador');
        localStorage.removeItem('token');
      }
    } 
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthAndFetchUser();
  }, [checkAuthAndFetchUser]);

const handleLogin = async (userLogin, senha) => {
  setLoading(true);
  setError(null);
  try {
    const data = await login(userLogin, senha); // agora login aqui é a função importada
    localStorage.setItem('token', data.accessToken);
    setAuthToken(data.accessToken);
    const userData = await fetchUserData();
    setIsLoggedIn(true);
    setUser(userData);
  } catch (err) {
    setIsLoggedIn(false);
    setUser(null);
    setError(err.message || 'Erro ao fazer login');
    localStorage.removeItem('token');
    throw err;
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return { isLoggedIn, user, loading, error, login: handleLogin, logout };
};

export default useAuth;
