// --- START OF FILE HomeBalanceOverview.jsx ---

// RUTA: frontend/src/components/home/HomeBalanceOverview.jsx (NUEVO COMPONENTE)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../../store/userStore';
import { HiOutlineArrowUpOnSquare } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const HomeBalanceOverview = ({ onWithdrawClick }) => {
  const { t } = useTranslation();
  const user = useUserStore(state => state.user);

  // Verificación para asegurar que el usuario existe antes de intentar acceder a sus propiedades
  const userBalance = user?.balance?.usdt ?? 0;
  const isWithdrawalReady = user?.isWithdrawalPasswordSet && user?.withdrawalAddress?.isSet;

  const handleWithdraw = () => {
    // Reutilizamos la lógica de validación para una experiencia consistente
    if (!user?.isWithdrawalPasswordSet) {
      toast.error(t('profilePage.toasts.passwordNotSet'));
      // En un futuro, podríamos pasar una función para abrir el modal de contraseña desde aquí
      return;
    }
    if (!user?.withdrawalAddress?.isSet) {
      toast.error(t('profilePage.toasts.walletNotSet'));
      // En un futuro, podríamos pasar una función para abrir el modal de dirección desde aquí
      return;
    }
    onWithdrawClick();
  };

  return (
    <div className="bg-surface/50 backdrop-blur-md rounded-2xl p-5 border border-border shadow-medium flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-text-secondary">{t('homePage.balanceOverview.currentBalance', 'Saldo Actual')}</span>
          <span className="text-3xl font-bold text-text-primary mt-1">
            {userBalance.toFixed(2)} <span className="text-xl font-semibold text-text-secondary">USDT</span>
          </span>
        </div>
      </div>
      <button 
        onClick={handleWithdraw}
        className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-accent text-white font-bold transition-all hover:bg-accent-hover active:scale-95 shadow-lg shadow-accent/20"
      >
        <HiOutlineArrowUpOnSquare className="w-6 h-6" />
        <span>{t('homePage.balanceOverview.withdraw', 'Retirar')}</span>
      </button>
    </div>
  );
};

export default HomeBalanceOverview;

// --- END OF FILE HomeBalanceOverview.jsx ---