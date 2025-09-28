// frontend/src/components/layout/AdminProtectedRoute.jsx (v2.0 - LÓGICA SIMPLIFICADA)

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAdminStore from '../../store/adminStore';
import Loader from '../common/Loader';

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAdminStore();
  const location = useLocation();

  // El estado 'isLoading' del store nos dice si se está procesando un login.
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-dark-primary">
        <Loader text="Verificando..." />
      </div>
    );
  }

  // La condición es simple: si está autenticado, permite el acceso a las rutas anidadas (Outlet).
  // Si no, lo redirige a la página de login, guardando la página que intentaba visitar.
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} replace />
  );
};

export default AdminProtectedRoute;