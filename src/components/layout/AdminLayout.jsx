// RUTA: frontend/src/components/layout/AdminLayout.jsx (REDiseñado CON TEMA OSCURO)

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../pages/admin/components/Sidebar';
import useAdminStore from '../../store/adminStore';
import AdminHeaderMobile from '../../pages/admin/components/AdminHeaderMobile';
import MobileDrawer from '../../pages/admin/components/MobileDrawer';

const routeTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Gestión de Usuarios',
  '/admin/transactions': 'Transacciones',
  '/admin/withdrawals': 'Retiros Pendientes',
  '/admin/treasury': 'Tesorería',
  '/admin/gas-dispenser': 'Dispensador de Gas',
  '/admin/notifications': 'Notificaciones',
  '/admin/blockchain-monitor': 'Monitor Blockchain',
  '/admin/factories': 'Gestión de Fábricas',
  '/admin/security': 'Seguridad',
  '/admin/settings': 'Ajustes del Sistema',
};

const AdminLayout = () => {
  const { admin, logout } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Admin Panel');

  useEffect(() => {
    const currentTitle = Object.entries(routeTitles).find(([path]) => location.pathname.startsWith(path))?.[1] || 'Admin Panel';
    setPageTitle(currentTitle);
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // --- INICIO DE CAMBIOS VISUALES ---
  return (
    <div className="flex min-h-screen bg-dark-primary text-gray-200">
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      <MobileDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

      <div className="flex-grow flex flex-col">
        <header className="hidden bg-dark-secondary p-4 md:flex justify-end items-center border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-text-secondary">Bienvenido, <strong className="text-white">{admin?.username}</strong></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-bold text-red-400 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        <AdminHeaderMobile onMenuClick={() => setIsDrawerOpen(true)} title={pageTitle} />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
  // --- FIN DE CAMBIOS VISUALES ---
};

export default AdminLayout;