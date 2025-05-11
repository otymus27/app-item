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

        // Extraindo a role corretamente (pegando o primeiro item do array `roles`)
        const role = userData.roles.length > 0 ? userData.roles[0].nome : 'USER';

        setIsLoggedIn(true);
        setUser({ ...userData, role }); // Inclui a role no estado do usuário
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
      const data = await login(userLogin, senha);
      localStorage.setItem('token', data.accessToken);
      setAuthToken(data.accessToken);

      const userData = await fetchUserData();

      // Extraindo role do token após login
      const decodedToken = JSON.parse(atob(data.accessToken.split('.')[1]));
      const role = decodedToken.role || 'user';

      setIsLoggedIn(true);
      setUser({ ...userData, role });
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
