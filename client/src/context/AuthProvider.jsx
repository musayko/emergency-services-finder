import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // <-- IMPORT THE CONTEXT FROM ITS NEW FILE

// The rest of the file is the same as before
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    try {
      const token = localStorage.getItem('user_token');
      if (token) {
        // We'll parse the token to make sure it's not malformed
        setUser({ token: JSON.parse(token) });
      }
    } catch (error) {
      // If JSON.parse fails or anything else, we clear the bad token
      console.error("Failed to parse user token from localStorage:", error);
      localStorage.removeItem('user_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('user_token', JSON.stringify(token));
    setUser({ token });
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