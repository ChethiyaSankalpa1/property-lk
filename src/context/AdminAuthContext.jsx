import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

const ADMIN_AUTH_KEY = 'property_lk_admin_session';
const ADMIN_CREDENTIALS_KEY = 'property_lk_admin_pin';
const DEFAULT_PIN = 'admin123';

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  const [currentPin, setCurrentPin] = useState(() => {
    return localStorage.getItem(ADMIN_CREDENTIALS_KEY) || DEFAULT_PIN;
  });

  const login = (inputPin) => {
    if (inputPin === currentPin) {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Password / PIN. Default is "admin123"' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const updatePin = (oldPin, newPin) => {
    if (oldPin !== currentPin) {
      return { success: false, message: 'Current password/PIN is incorrect.' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: 'New password/PIN must be at least 4 characters.' };
    }
    setCurrentPin(newPin);
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, newPin);
    return { success: true };
  };

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      updatePin,
      defaultPinHint: DEFAULT_PIN,
      securityDisclaimer: "PROTOTYPE NOTICE: This website is a frontend-only application hosted on Vercel. Listings and admin states are stored in browser LocalStorage. Frontend-only credentials are for demonstration purposes and cannot prevent client-side inspection. For production enterprise security, connect an authenticated backend or serverless service."
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
