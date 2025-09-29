// --- START OF FILE HomeBalanceOverview.jsx ---

// RUTA: frontend/src/components/home/HomeBalanceOverview.jsx (v2.0 - DISEÑO DE REFERENCIA FINAL)

import React from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../../store/userStore';
import { HiOutlineArrowUpOnSquare } from 'react-iicons/hi2';
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
    // Se utiliza el color 'surface' para la tarjeta, que ahora es un gris oscuro.
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