import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { HiOutlineClipboardDocument, HiShieldCheck, HiExclamationTriangle, HiQrCode } from 'react-icons/hi2';
import Loader from '../components/common/Loader';

const DepositAddressPage = () => {
  const { t } = useTranslation();
  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generate = async () => {
      try {
        // Asumimos que este endpoint devuelve o genera la wallet BSC
        const { data } = await api.post('/payment/generate-address', { chain: 'BSC' });
        setAddressData(data);
      } catch (error) {
        toast.error('Error generando dirección');
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, []);

  const copyToClipboard = () => {
    if (addressData?.address) {
      navigator.clipboard.writeText(addressData.address);
      toast.success('¡Dirección copiada!');
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader text="Generando Bóveda..." /></div>;

  return (
    <div className="flex flex-col h-full p-4 pt-8 pb-20 overflow-y-auto no-scrollbar">
      <h1 className="text-2xl font-bold text-white mb-2">Recargar Saldo</h1>
      <p className="text-sm text-text-secondary mb-6">Envía USDT (Red BEP20) para obtener potencia.</p>

      {/* TARJETA PRINCIPAL */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-3xl p-6 border border-border shadow-2xl relative overflow-hidden"
      >
        {/* Decoración QR de fondo */}
        <HiQrCode className="absolute -top-10 -right-10 w-40 h-40 text-white/5 rotate-12" />

        <div className="flex flex-col items-center relative z-10">
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
                <QRCode value={addressData?.address || ''} size={180} />
            </div>

            <div className="w-full">
                <p className="text-[10px] text-text-secondary uppercase font-bold mb-2 tracking-widest text-center">Tu Dirección BEP20 (BSC)</p>
                <div onClick={copyToClipboard} className="bg-background/80 p-4 rounded-xl border border-accent/30 flex items-center justify-between gap-3 cursor-pointer group hover:bg-background transition-colors">
                    <p className="text-xs font-mono text-white break-all text-center flex-1">
                        {addressData?.address}
                    </p>
                    <HiOutlineClipboardDocument className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                </div>
            </div>
        </div>
      </motion.div>

      {/* ADVERTENCIAS */}
      <div className="mt-6 space-y-3">
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <HiExclamationTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
            <p className="text-xs text-yellow-200/80">
                <strong className="text-yellow-500 block mb-1">Solo Red BSC (BEP20)</strong>
                Enviar USDT por otra red (como TRC20 o Ethereum) resultará en la pérdida permanente de los fondos.
            </p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <HiShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
            <p className="text-xs text-green-200/80">
                Depósito seguro. Acreditación automática tras 1 confirmación de red.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DepositAddressPage;