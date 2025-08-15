// RUTA: frontend/src/App.jsx (v2.1 - CON SOPORTE RTL PARA ÁRABE)

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useUserStore from './store/userStore';
import { useTranslation } from 'react-i18next'; // Importación ya presente, se utilizará.

// --- IMPORTS ---
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import AdminProtectedRoute from './components/layout/AdminProtectedRoute';
import Loader from './components/common/Loader';
import MaintenanceScreen from './components/MaintenanceScreen';
import HomePage from './pages/HomePage';
import FactoriesPage from './pages/FactoriesPage'; 
import RankingPage from './pages/RankingPage';
import TeamPage from './pages/TeamPage';
import ProfilePage from './pages/ProfilePage';
import LanguagePage from './pages/LanguagePage';
import NotFoundPage from './pages/NotFoundPage';
import FaqPage from './pages/FaqPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import FinancialHistoryPage from './pages/FinancialHistoryPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import AdminWithdrawalsPage from './pages/admin/AdminWithdrawalsPage';
import AdminFactoriesPage from './pages/admin/AdminFactoriesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminSecurityPage from './pages/admin/AdminSecurityPage';
import AdminTreasuryPage from './pages/admin/AdminTreasuryPage';
import SweepControlPage from './pages/admin/SweepControlPage';
import GasDispenserPage from './pages/admin/GasDispenserPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage'; 
import AdminBlockchainMonitorPage from './pages/admin/AdminBlockchainMonitorPage';

const AppInitializer = () => {
    const { isAuthenticated, syncUserWithBackend } = useUserStore();
    useEffect(() => {
        if (isAuthenticated) return;
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user?.id) {
            syncUserWithBackend(tg.initDataUnsafe.user);
        }
    }, [isAuthenticated, syncUserWithBackend]);
    return null;
};

const UserGatekeeper = ({ children }) => { 
  const { isAuthenticated, isLoadingAuth, isMaintenanceMode, maintenanceMessage } = useUserStore();
  
  if (isMaintenanceMode) {
      return <MaintenanceScreen message={maintenanceMessage} />;
  }
  
  if (isLoadingAuth) { 
    return ( <div className="w-full h-screen flex items-center justify-center bg-background"><Loader text="Autenticando..." /></div> ); 
  } 
  if (!isAuthenticated) { 
    return ( <div className="w-full h-screen flex items-center justify-center p-4 bg-background text-text-secondary text-center">Error de autenticación.<br/>Por favor, reinicia la app desde Telegram.</div> ); 
  } 
  return children; 
};

function App() {
  // --- INICIO DE LÓGICA RTL ---
  const { i18n } = useTranslation();

  useEffect(() => {
    // Esta función se ejecutará cada vez que cambie el idioma.
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    // Se aplica la dirección al tag <html>, permitiendo que Tailwind CSS ajuste el layout.
    document.documentElement.dir = direction;
  }, [i18n.language]);
  // --- FIN DE LÓGICA RTL ---

  return (
    <Router>
      <Routes>
        {/* --- Rutas de Administración (Sin cambios) --- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id/details" element={<AdminUserDetailPage />} />
            <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
            <Route path="/admin/withdrawals" element={<AdminWithdrawalsPage />} />
            <Route path="/admin/factories" element={<AdminFactoriesPage />} />
            <Route path="/admin/security" element={<AdminSecurityPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/treasury" element={<AdminTreasuryPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/sweep-control" element={<SweepControlPage />} />
            <Route path="/admin/gas-dispenser" element={<GasDispenserPage />} />
            <Route path="/admin/blockchain-monitor" element={<AdminBlockchainMonitorPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* --- Rutas de Usuario (Sin cambios en su estructura) --- */}
        <Route path="/*" element={
          <>
            <AppInitializer />
            <UserGatekeeper>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route element={<Layout />}>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/factories" element={<FactoriesPage />} />
                  <Route path="/ranking" element={<RankingPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/history" element={<FinancialHistoryPage />} />
                </Route>
                <Route path="/language" element={<LanguagePage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </UserGatekeeper>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;