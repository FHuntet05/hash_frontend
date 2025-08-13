// RUTA: frontend/src/components/modals/DepositAmountModal.jsx (DISEÑO CRISTALINO)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const DepositAmountModal = ({ onProceed, onClose }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');

  const handleProceed = () => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error(t('depositAmountModal.invalidAmountToast', 'Por favor, introduce una cantidad válida.'));
      return;
    }
    onProceed(numericAmount);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-card/80 backdrop-blur-lg rounded-2xl w-full max-w-sm text-text-primary border border-white/20 shadow-medium"
        variants={modalVariants} onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-text-primary">{t('depositAmountModal.title', 'Monto a Depositar')}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-text-tertiary hover:text-text-primary hover:bg-black/10 transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </header>
        
        <main className="px-6 space-y-4">
          <p className="text-text-secondary text-sm">
            {t('depositAmountModal.instruction', 'Introduce la cantidad de USDT que deseas depositar en tu cuenta.')}
          </p>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('depositAmountModal.placeholder', 'Ej: 50.00')}
              className="w-full bg-background/50 text-text-primary text-2xl font-bold p-4 rounded-lg border-2 border-border focus:border-accent-primary focus:outline-none transition-colors"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-text-tertiary">USDT</span>
          </div>
        </main>

        <footer className="p-6 mt-2">
            <button
                onClick={handleProceed}
                disabled={!amount}
                className="w-full py-3 bg-accent-primary text-white text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-accent-primary-hover active:scale-95"
            >
                {t('common.continue', 'Continuar')}
            </button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default DepositAmountModal;