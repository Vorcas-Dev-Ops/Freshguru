import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const API_URL = 'http://localhost:5055/api';

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.admin);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const login = (token, admin) => {
    localStorage.setItem('admin_token', token);
    setProfile(admin);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
      } catch (err) {
        console.error('Logout logging failed:', err);
      }
    }
    localStorage.removeItem('admin_token');
    setProfile(null);
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <UserContext.Provider value={{ profile, isAuthenticated, loading, login, logout, darkMode, toggleDarkMode }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
