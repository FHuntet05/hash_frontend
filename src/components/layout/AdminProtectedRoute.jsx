// frontend/src/components/layout/AdminProtectedRoute.jsx (VERSIÓN CON ADMIN STORE)

import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAdminStore from '../../store/adminStore'; // MODIFICADO: Se usa el store de admin
import Loader from '../common/Loader';

const AdminProtectedRoute = () => {
  // MODIFICADO: La fuente de verdad ahora es useAdminStore
  const { admin, isAuthenticated, isLoading, isHydrated, setHydrated } = useAdminStore();

  // El estado de 'isHydrated' nos dice si Zustand ha terminado de cargar los datos desde localStorage.
  // Es necesario esperar a que esto ocurra para tomar una decisión.
  useEffect(() => {
    // Esta función se llama desde el store cuando la rehidratación termina.
    // La llamamos aquí también por si el store ya se rehidrató.
    useAdminStore.persist.rehydrate();
  }, []);


  // Mientras los datos persistidos se cargan, mostramos un loader.
  if (!isHydrated) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-dark-primary">
        <Loader text="Cargando sesión de admin..." />
      </div>
    );
  }

  // Si está cargando una petición de login, también esperamos.
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-dark-primary">
        <Loader text="Verificando sesión..." />
      </div>
    );
  }

  // La condición de acceso es simple: ¿está el admin autenticado en su propio store?
  const isAuthorizedAdmin = isAuthenticated && admin?.role === 'admin';
  
  // Si está autorizado, se le da acceso. Si no, se le redirige a la página de login.
  return isAuthorizedAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;