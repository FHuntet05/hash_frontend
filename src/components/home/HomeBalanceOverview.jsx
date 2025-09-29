// --- START OF FILE HomeBalanceOverview.jsx ---

// RUTA: frontend/src/components/home/HomeBalanceOverview.jsx (v2.1 - CORRECCIÓN DE IMPORTACIÓN)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../../store/userStore';
// --- INICIO DE CORRECCIÓN CRÍTICA ---
// Se corrige el error de tipeo en la importación de 'react-icons'.
import { HiOutlineArrowUpOnSquare } from 'react-icons/hi2'; 
// --- FIN DE CORRECCIÓN CRÍTICA ---
import toast from 'react-hot-toast';

const HomeBalanceOverview = ({ onWithdrawClick }) => {
  const { t } = useTranslation();
  const user = useUserStore(state => state.user);

  const userBalance = user?.balance?.usdt ?? 0;

  const handleWithdraw = () => {
    if (!user?.isWithdrawalPasswordSet) {
      toast.error(t('profilePage.toasts.passwordNotSet'));
      return;
    }
    if (!user?.withdrawalAddress?.isSet) {
      toast.error(t('profilePage.toasts.walletNotSet'));
      return;
    }
    onWithdrawClick();
  };

  return (
    <div className="bg-surface rounded-2xl p-5 border border-border flex flex-col gap-4 shadow-medium">
      <div className="text-center">
        <span className="text-sm text-text-secondary">{t('homePage.balanceOverview.currentBalance', 'Saldo Actual')}</span>
        <p className="text-4xl font-bold text-text-primary mt-1">
          {userBalance.toFixed(2)} <span className="text-2xl font-semibold text-text-secondary align-middle">USDT</span>
        </p>
      </div>
      
      <button 
        onClick={handleWithdraw}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-accent text-white font-bold transition-all hover:bg-accent-hover active:scale-95 shadow-lg shadow-accent/20"
      >
        <HiOutlineArrowUpOnSquare className="w-5 h-5" />
        <span>{t('homePage.balanceOverview.withdraw', 'Retirar')}</span>
      </button>
    </div>
  );
};

export default HomeBalanceOverview;

// --- END OF FILE HomeBalanceOverview.jsx ---