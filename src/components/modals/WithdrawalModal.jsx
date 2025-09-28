// RUTA: frontend/src/components/modals/WithdrawalModal.jsx (v4.0 - FEATURE-001: MODO DE SOLO LECTURA)

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiShieldCheck, HiOutlineWallet, HiLockClosed } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import api from '../../api/axiosConfig';

const WithdrawalModal = ({ onClose, onGoToSetPassword }) => {
  const { t } = useTranslation();
  const { user, settings, setUser } = useUserStore();
  
  const userBalance = user?.balance?.usdt || 0;
  const minWithdrawal = settings?.minWithdrawal || 1.0;
  const withdrawalFee = settings?.withdrawalFeePercent || 0;
  const isWithdrawalPasswordSet = user?.isWithdrawalPasswordSet || false;
  
  // CAMBIO CRÍTICO: Se obtiene la dirección de retiro del nuevo campo en el estado del usuario.
  const savedWalletAddress = user?.withdrawalAddress?.address;

  const [amount, setAmount] = useState('');
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { feeAmount, netAmount } = useMemo(() => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return { feeAmount: 0, netAmount: 0 };
    const fee = numericAmount * (withdrawalFee / 100);
    return { feeAmount: fee, netAmount: numericAmount - fee };
  }, [amount, withdrawalFee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (!amount || !withdrawalPassword) return toast.error(t('withdrawalModal.toasts.allFieldsRequired'));
    if (isNaN(numericAmount) || numericAmount < minWithdrawal) return toast.error(t('withdrawalModal.toasts.minAmount', { minWithdrawal }));
    if (numericAmount > userBalance) return toast.error(t('withdrawalModal.toasts.insufficientBalance'));
    
    setIsProcessing(true);
    // CAMBIO CRÍTICO: La petición a la API ya no envía 'walletAddress'. El backend la obtiene del usuario.
    const withdrawalPromise = api.post('/wallet/request-withdrawal', {
      amount: numericAmount,
      withdrawalPassword,
    });

    toast.promise(withdrawalPromise, {
      loading: t('withdrawalModal.toasts.processing'),
      success: (res) => {
        setUser(res.data.user);
        onClose();
        return res.data.message;
      },
      error: (err) => err.response?.data?.message || t('withdrawalModal.toasts.error'),
    }).finally(() => setIsProcessing(false));
  };

  const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-surface/80 backdrop-blur-lg rounded-2xl w-full max-w-sm text-text-primary border border-border shadow-medium flex flex-col max-h-[90vh]"
        variants={modalVariants} onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-6 pb-4">
            <button className="absolute top-4 right-4 text-text-secondary hover:text-text-primary" onClick={onClose}><HiXMark className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold text-center">{t('withdrawalModal.title')}</h2>
            <p className="text-sm text-center text-text-secondary mt-1">{t('withdrawalModal.balance')} <span className="font-semibold text-text-primary">{userBalance.toFixed(2)} USDT</span></p>
        </header>
        
        <main className="flex-grow p-6 pt-2 overflow-y-auto no-scrollbar">
          {isWithdrawalPasswordSet ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CAMBIO CRÍTICO: El input de dirección ha sido reemplazado por un display de solo lectura. */}
              <div>
                <label className="text-sm text-text-secondary mb-1 block">{t('withdrawalModal.addressLabelSaved', 'Se enviará a la billetera:')}</label>
                <div className="flex items-center bg-background/50 p-3 rounded-lg border border-border text-sm">
                  <HiOutlineWallet className="w-5 h-5 text-text-secondary mr-3 flex-shrink-0" />
                  <p className="font-mono break-all text-text-primary">{savedWalletAddress}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-text-secondary mb-1 block">{t('withdrawalModal.amountLabel')}</label>
                <div className="flex items-center bg-background/50 rounded-lg border border-border">
                  <input type="number" step="0.01" placeholder={t('withdrawalModal.minPlaceholder', { minWithdrawal })} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent p-3 focus:outline-none" />
                  <button type="button" onClick={() => setAmount(userBalance.toString())} className="font-bold text-accent pr-4 flex-shrink-0">{t('common.max')}</button>
                </div>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">{t('withdrawalModal.passwordLabel')}</label>
                <input type="password" placeholder="••••••••" value={withdrawalPassword} onChange={(e) => setWithdrawalPassword(e.target.value)} className="w-full bg-background/50 p-3 rounded-lg border border-border" />
              </div>

              <div className="text-sm space-y-1 bg-background/50 p-3 rounded-lg border border-border">
                <div className="flex justify-between text-text-secondary"><span>{t('withdrawalModal.fee', { fee: withdrawalFee })}</span><span>- {feeAmount.toFixed(4)} USDT</span></div>
                <div className="flex justify-between font-bold"><span>{t('withdrawalModal.youReceive')}</span><span>{netAmount > 0 ? netAmount.toFixed(4) : '0.0000'} USDT</span></div>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full mt-2 py-3 bg-accent text-white font-bold rounded-full disabled:opacity-50 hover:bg-accent-hover active:scale-95 transition-all">
                {isProcessing ? t('common.processing') : t('withdrawalModal.confirmButton')}
              </button>
            </form>
          ) : (
             <div className="text-center bg-accent-tertiary/10 p-4 rounded-lg border border-accent-tertiary/20">
              <HiLockClosed className="w-10 h-10 mx-auto text-accent-tertiary mb-2" />
              <h3 className="font-bold text-text-primary">{t('withdrawalModal.passwordNotSetTitle')}</h3>
              <p className="text-sm text-text-secondary mt-2 mb-4">{t('withdrawalModal.passwordNotSetBody')}</p>
              <button onClick={onGoToSetPassword} className="w-full py-2 bg-accent-tertiary text-white font-bold rounded-full">
                {t('withdrawalModal.goToSettingsButton')}
              </button>
            </div>
          )}
        </main>
        
        <footer className="flex-shrink-0 p-6 pt-4">
            <div className="flex items-start gap-2 text-xs text-text-secondary">
                <HiShieldCheck className="w-8 h-8 text-status-success flex-shrink-0"/>
                <p>{t('withdrawalModal.notice')}</p>
            </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default WithdrawalModal;