import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from sessionStorage)
  useEffect(() => {
    const savedUser = sessionStorage.getItem('agrovision_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
        sessionStorage.removeItem('agrovision_user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }
      
      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }
      
      const data = await response.json();
      const userData = {
        id: data.farmer.id,
        username: data.farmer.username,
        email: data.farmer.email,
      };
      
      setUser(userData);
      sessionStorage.setItem('agrovision_user', JSON.stringify(userData));
      
      return { success: true, message: data.message, history: data.history };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('agrovision_user');
  };

  const syncHistory = async (history) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/sync-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: user.id,
          history: history,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      
      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, syncHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
