import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    isAuthenticated: localStorage.getItem('token') !== null,
  });

  const login = (token, username) => {
    setAuthState({
      token,
      username,
      isAuthenticated: true,
    });
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); // Save username in localStorage
  };

  const logout = () => {
    setAuthState({
      token: null,
      username: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Remove username from localStorage
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
