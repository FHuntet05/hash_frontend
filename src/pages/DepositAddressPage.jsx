// --- START OF FILE DepositAddressPage.jsx ---

// RUTA: frontend/src/pages/DepositAddressPage.jsx (v2.1 - SINCRONIZADO CON depositConfig.js)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlineClipboardDocument, HiOutlineInformationCircle } from 'react-icons/hi2';

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
        if (network.type === 'dynamic') { // Solo USDT BEP20 es dinámico
          const response = await api.post('/wallet/create-deposit-address');
          setPaymentInfo(response.data);
        } else { // El resto son estáticos y usan la nueva configuración
          
          // --- INICIO DE MODIFICACIÓN CRÍTICA ---
          // Se reemplaza la lógica de construcción de claves por un mapeo directo y robusto.
          let addressKey;
          switch (network.id) {
            case 'usdt-trc20':
              addressKey = 'USDT-TRC20';
              break;
            case 'bnb-bep20':
              addressKey = 'BNB';
              break;
            case 'tron-trc20':
              addressKey = 'TRON';
              break;
            default:
              throw new Error(t('deposit.address.unknownNetwork', 'Red desconocida.'));
          }
          // --- FIN DE MODIFICACIÓN CRÍTICA ---

          const staticAddress = STATIC_DEPOSIT_ADDRESSES[addressKey];
          
          if (staticAddress) {
            setPaymentInfo({ 
              paymentAddress: staticAddress, 
              currency: network.name, 
              network: network.network,
              isStatic: true
            });
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
    if (!paymentInfo?.paymentAddress) return;
    navigator.clipboard.writeText(paymentInfo.paymentAddress);
    toast.success(t('deposit.address.copied', 'Dirección copiada al portapapeles'));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 pt-6">
        <header className="flex-shrink-0 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 mr-2"><HiArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold">{t('deposit.address.generating', 'Generando Dirección...')}</h1>
        </header>
        <div className="flex-grow flex items-center justify-center"><Loader /></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 pt-6 gap-6">
      <header className="flex-shrink-0 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 mr-2"><HiArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold">{t('deposit.address.title', 'Depositar {{currency}}', { currency: paymentInfo.currency })}</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center gap-6">
        <div className="bg-white p-4 rounded-xl border-4 border-accent">
          <QRCodeSVG value={paymentInfo.paymentAddress} size={200} />
        </div>

        <div className="w-full">
          <p className="text-sm text-text-secondary mb-2">{t('deposit.address.sendOnly', 'Enviar solo {{currency}} a través de la red {{network}}', { currency: paymentInfo.currency, network: paymentInfo.network })}</p>
          <div className="bg-surface p-3 rounded-xl border border-border flex items-center justify-between gap-2">
            <p className="font-mono text-sm text-text-primary break-all flex-1 text-left">{paymentInfo.paymentAddress}</p>
            <button onClick={handleCopy} className="p-2 text-accent flex-shrink-0"><HiOutlineClipboardDocument className="w-6 h-6" /></button>
          </div>
        </div>

        {paymentInfo.isStatic && (
            <div className="w-full bg-amber-500/10 text-amber-400 text-xs rounded-lg p-3 flex items-start gap-2 border border-amber-500/20">
                <HiOutlineInformationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{t('deposit.address.staticNotice', 'Las transferencias en esta red pueden tardar de 5 a 10 minutos en acreditarse después de ser confirmadas.')}</p>
            </div>
        )}
      </main>

      <footer className="text-center text-xs text-text-secondary">
        <p>{t('deposit.address.confirmationNotice', 'Los fondos serán acreditados tras las confirmaciones de la red.')}</p>
      </footer>
    </div>
  );
};

export default DepositAddressPage;

// --- END OF FILE DepositAddressPage.jsx ---