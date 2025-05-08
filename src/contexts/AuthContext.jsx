import { createContext, useContext, useState } from 'react';
import { login as loginRequest, setAuthToken } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, senha) => {
    const data = await loginRequest(email, senha);
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
