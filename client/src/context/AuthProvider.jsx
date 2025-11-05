import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('user_token');
      if (token) {
        const decodedUser = jwtDecode(token);
        setUser({ ...decodedUser, token });
      }
    } catch (error) {
      console.error("Failed to parse user token from localStorage:", error);
      localStorage.removeItem('user_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    const decodedUser = jwtDecode(token);
    localStorage.setItem('user_token', token);
    setUser({ ...decodedUser, token });
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};