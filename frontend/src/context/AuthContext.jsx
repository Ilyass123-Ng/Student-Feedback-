'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // --- 1. On Mount: Check for existing session ---
  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      try {
        const decoded = jwtDecode(saved);
        // Ila token baqi khdam (not expired)
        if (decoded.exp * 1000 > Date.now()) {
          setToken(saved);
          setUser(decoded);
        } else localStorage.removeItem('token');
      } catch { localStorage.removeItem('token'); }
    }
  }, []);

  // --- 2. Login & Logout ---
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(jwtDecode(newToken));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, setUser, login, logout,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
