// RUTA: frontend/src/components/modals/DirectDepositModal.jsx (DISEÑO CRISTALINO)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiOutlineClipboardDocument, HiOutlineClipboardDocumentCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const useCopy = () => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success(t('common.copied', 'Copiado al portapapeles'));
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return [isCopied, handleCopy];
};

const DirectDepositModal = ({ paymentInfo, onClose }) => {
  const { t } = useTranslation();
  const [addressCopied, copyAddress] = useCopy();
  const [amountCopied, copyAmount] = useCopy();
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}
    >
      <motion.div
        className="relative bg-card/80 backdrop-blur-lg rounded-2xl w-full max-w-sm text-text-primary border border-white/20 shadow-medium flex flex-col max-h-[90vh]"
        variants={modalVariants} onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex justify-between items-center p-6 pb-4">
          <h2 className="text-xl font-bold">{t('directDepositModal.title', 'Realizar Depósito')}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-text-tertiary hover:text-text-primary hover:bg-black/10 transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow overflow-y-auto px-6 no-scrollbar">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-text-secondary text-sm">{t('directDepositModal.instruction', 'Escanea el código QR o copia la dirección para enviar la cantidad exacta.')}</p>
            <div className="bg-white p-3 rounded-lg"><QRCodeSVG value={paymentInfo.paymentAddress} size={160} /></div>
            <div className="text-lg font-mono text-status-danger">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
            <div className="w-full bg-background/50 p-3 rounded-lg border border-border">
              <label className="text-xs text-text-secondary">{t('directDepositModal.amountLabel', 'Cantidad a Enviar')}</label>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-accent-primary break-all">{paymentInfo.paymentAmount}</p>
                <button onClick={() => copyAmount(paymentInfo.paymentAmount)} className="p-2 text-text-secondary hover:text-accent-primary">
                  {amountCopied ? <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-status-success" /> : <HiOutlineClipboardDocument className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="w-full bg-background/50 p-3 rounded-lg border border-border">
              <label className="text-xs text-text-secondary">{t('directDepositModal.addressLabel', `Dirección ${paymentInfo.currency}`)}</label>
              <div className="flex justify-between items-center">
                <p className="text-sm font-mono break-all pr-2">{paymentInfo.paymentAddress}</p>
                <button onClick={() => copyAddress(paymentInfo.paymentAddress)} className="p-2 text-text-secondary hover:text-accent-primary">
                  {addressCopied ? <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-status-success" /> : <HiOutlineClipboardDocument className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="w-full text-xs text-center text-accent-tertiary bg-accent-tertiary/10 p-3 rounded-lg border border-accent-tertiary/20">
              <strong>{t('directDepositModal.warning', `Asegúrate de enviar ${paymentInfo.currency} a través de la red correcta (BEP20).`)}</strong>
            </div>
          </div>
        </main>
        
        <footer className="flex-shrink-0 p-6 pt-4">
          <button onClick={onClose} className="w-full py-3 bg-accent-secondary text-white text-lg font-bold rounded-full hover:bg-accent-secondary-hover active:scale-95 transition-all">
            {t('directDepositModal.paidButton', 'Ya Pagué')}
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default DirectDepositModal;