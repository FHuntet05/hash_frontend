// --- START OF FILE DepositAddressPage.jsx ---

// RUTA: frontend/src/pages/DepositAddressPage.jsx (NUEVA PÁGINA)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlineClipboardDocument } from 'react-icons/hi2';

import api from '../api/axiosConfig';
import Loader from '../components/common/Loader';
import { STATIC_DEPOSIT_ADDRESSES } from '../config/depositConfig';

const DepositAddressPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { network } = location.state || {};

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!network) {
      toast.error(t('deposit.address.noNetworkSelected', 'No se ha seleccionado ninguna red.'));
      navigate(-1);
      return;
    }

    const generateAddress = async () => {
      try {
        // Lógica adaptada del modal original
        const isDynamic = network.network.includes('BEP20') && network.name === 'USDT';
        if (isDynamic) {
          const response = await api.post('/wallet/create-deposit-address');
          setPaymentInfo(response.data);
        } else {
          const addressKey = 'USDT-TRC20'; // Simplificado, asumiendo TRC20 por ahora
          const staticAddress = STATIC_DEPOSIT_ADDRESSES[addressKey];
          if (staticAddress) {
            setPaymentInfo({ paymentAddress: staticAddress, currency: network.name, network: network.network });
          } else {
            throw new Error(t('deposit.address.notConfigured', 'Dirección no configurada.'));
          }
        }
      } catch (error) {
        toast.error(error.message || t('common.error'));
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    generateAddress();
  }, [network, navigate, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentInfo.paymentAddress);
    toast.success(t('deposit.address.copied', 'Dirección copiada al portapapeles'));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex-shrink-0 p-4 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 mr-2"><HiArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold">{t('deposit.address.generating', 'Generando Dirección...')}</h1>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-6">
      <header className="flex-shrink-0 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 mr-2"><HiArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold">{t('deposit.address.title', 'Depositar {{currency}}', { currency: paymentInfo.currency })}</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center gap-6">
        <div className="bg-white p-4 rounded-xl border-4 border-accent">
          <QRCodeSVG value={paymentInfo.paymentAddress} size={200} />
        </div>

        <div className="w-full">
          <p className="text-sm text-text-secondary mb-2">{t('deposit.address.sendOnly', 'Enviar solo {{currency}} ({{network}})', { currency: paymentInfo.currency, network: paymentInfo.network })}</p>
          <div className="bg-surface p-3 rounded-xl border border-border flex items-center justify-between gap-2">
            <p className="font-mono text-sm text-text-primary break-all flex-1 text-left">{paymentInfo.paymentAddress}</p>
            <button onClick={handleCopy} className="p-2 text-accent flex-shrink-0"><HiOutlineClipboardDocument className="w-6 h-6" /></button>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-text-secondary">
        <p>{t('deposit.address.confirmationNotice', 'Los fondos serán acreditados tras las confirmaciones de la red.')}</p>
      </footer>
    </div>
  );
};

export default DepositAddressPage;

// --- END OF FILE DepositAddressPage.jsx ---