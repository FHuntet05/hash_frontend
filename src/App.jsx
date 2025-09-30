// --- START OF FILE App.jsx ---

// RUTA: frontend/src/App.jsx (v3.3 - VERSIÓN COMPLETA PARA APLICAR EL NUEVO FONDO)

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useUserStore from './store/userStore';
import { useTranslation } from 'react-i18next';
import { useTelegram } from './hooks/useTelegram';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import AdminProtectedRoute from './components/layout/AdminProtectedRoute';
import Loader from './components/common/Loader';
import MaintenanceScreen from './components/MaintenanceScreen';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import MinersPage from './pages/MinersPage';
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
import AdminMinersPage from './pages/admin/AdminMinersPage';
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
        if (tg?.initDataUnsafe?.user?.id) { syncUserWithBackend(tg.initDataUnsafe.user); }
    }, [isAuthenticated, syncUserWithBackend]);
    return null;
};

const UserGatekeeper = ({ children }) => { 
  const { isAuthenticated, isLoadingAuth, isMaintenanceMode, maintenanceMessage } = useUserStore();
  if (isMaintenanceMode) return <MaintenanceScreen message={maintenanceMessage} />;
  if (isLoadingAuth) return ( <div className="w-full h-screen flex items-center justify-center"><Loader text="Autenticando..." /></div> ); 
  if (!isAuthenticated) return ( <div className="w-full h-screen flex items-center justify-center p-4 text-center">Error de autenticación.<br/>Por favor, reinicia la app desde Telegram.</div> ); 
  return children; 
};

function App() {
  const { i18n } = useTranslation();
  const { isTelegramWebApp } = useTelegram();

  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
  }, [i18n.language]);

  return (
    // Esta clase ahora aplicará el nuevo color azul oscuro '#0D1117'
    <div className="bg-background text-text-primary min-h-screen">
      <Router>
        <Routes>
          {isTelegramWebApp ? (
            <Route path="/*" element={
              <>
                <AppInitializer />
                <UserGatekeeper>
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route element={<Layout />}>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/market" element={<MinersPage />} />
                      <Route path="/team" element={<TeamPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/history" element={<FinancialHistoryPage />} />
                      <Route path="/ranking" element={<TasksPage />} />
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
          ) : (
            <>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/users/:id/details" element={<AdminUserDetailPage />} />
                  <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
                  <Route path="/admin/withdrawals" element={<AdminWithdrawalsPage />} />
                  <Route path="/admin/miners" element={<AdminMinersPage />} /> 
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
              <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

// --- END OF FILE App.jsx ---