import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Admin Fresh Guru',
      email: 'admin@freshguru.in',
      phone: '+91 9988776655',
      role: 'Super Admin',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC0vD4oIZ9RHF2wCjHoyEuTGnFaLw_uZzgHmxXsOZycGnN8sHTxbfIPUsx_2GsWAGpc3W4sMX9ImvhmgHb-5mV6ceZ6SwBqMmdRWot308zzgDODGv8rpIiy6a_kPwfSXEieeEvpM1Of431vs4nH1aLpYqYY19oBS1SVZI7e035hCW5miCJlHMY3VrXAhqwU2GH8JahvFr1hFIWawu1fPmA4G2HfHIGXIVqU4aS4XurhKjOwPXFiBrp3h3TDimPt7YC-rbAl4A8gw'
    };
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <UserContext.Provider value={{ profile, setProfile, darkMode, toggleDarkMode }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
