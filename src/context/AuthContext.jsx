import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, fetchUserData } from '../services/authService';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carrega o usuário autenticado usando o token do localStorage
   */
  const loadAuthenticatedUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setAuthToken(token);
    try {
      const userData = await fetchUserData();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
      handleLogout(); // remove token e limpa estado
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Realiza o login e carrega os dados do usuário
   */
  const handleLogin = async (login, senha) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(login, senha);
      localStorage.setItem('token', data.accessToken);
      setAuthToken(data.accessToken);

      const userData = await fetchUserData();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
      setUser(null);
      setIsLoggedIn(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpa dados e remove autenticação
   */
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  useEffect(() => {
    loadAuthenticatedUser();
  }, [loadAuthenticatedUser]);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, loading, error, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar o contexto de autenticação
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
