import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Public Layout & Pages
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import SellPropertyPage from './pages/SellPropertyPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddEditProperty from './pages/admin/AddEditProperty';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <PropertyProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Customer Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              <Route path="/sell" element={<SellPropertyPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin Authentication & Console Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="add" element={<AddEditProperty />} />
              <Route path="edit/:id" element={<AddEditProperty />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </PropertyProvider>
  );
}
