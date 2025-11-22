import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { 
    HiOutlineClipboardDocument, HiShieldCheck, 
    HiExclamationTriangle, HiQrCode, HiChevronLeft 
} from 'react-icons/hi2';
import Loader from '../components/common/Loader';

// --- TUS WALLETS HARDCODED ---
const HARDCODED_WALLETS = {
    'BNB':        '0x1aCd1Ad394c9d52c540ED6d5217D3AAf6D09e193',
    'USDT-TRC20': 'TCQvGydu9U22iy5sLvzXiZd93xseJ66db2',
    'TRX':        'TCQvGydu9U22iy5sLvzXiZd93xseJ66db2',
};

const DepositAddressPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { protocol } = location.state || { protocol: 'USDT-BEP20' };

  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        if (protocol === 'USDT-BEP20') {
            const { data } = await api.post('/payment/generate-address', { chain: 'BSC' });
            setAddressData({ address: data.address, type: 'dynamic', currency: 'USDT' });
        } else {
            const staticAddress = HARDCODED_WALLETS[protocol];
            if (staticAddress) {
                await new Promise(r => setTimeout(r, 600)); 
                setAddressData({ address: staticAddress, type: 'static', currency: protocol });
            } else {
                toast.error(`Error: Billetera para ${protocol} no configurada`);
                navigate(-1);
            }
        }
      } catch (error) {
        toast.error('Error de conexión');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [protocol, navigate]);

  const copyToClipboard = () => {
    if (addressData?.address) {
      navigator.clipboard.writeText(addressData.address);
      toast.success('¡Dirección copiada!');
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader text="Generando..." /></div>;

  return (
    <div className="flex flex-col h-full p-4 pt-8 pb-20 overflow-y-auto no-scrollbar">
      
      <button onClick={() => navigate(-1)} className="flex items-center text-text-secondary hover:text-white mb-4 text-sm transition-colors">
        <HiChevronLeft className="w-4 h-4 mr-1" /> Volver a selección
      </button>

      <h1 className="text-xl font-bold text-white mb-1">Depósito {protocol}</h1>
      <p className="text-xs text-text-secondary mb-4">
        Envía únicamente <span className="text-accent font-bold">{protocol}</span> a esta dirección.
      </p>

      {/* TARJETA QR COMPACTA */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-3xl p-5 border border-border shadow-2xl relative overflow-hidden"
      >
        <HiQrCode className="absolute -top-10 -right-10 w-32 h-32 text-white/5 rotate-12" />

        <div className="flex flex-col items-center relative z-10">
            {/* QR REDUCIDO */}
            <div className="bg-white p-3 rounded-xl shadow-lg mb-4 border-4 border-white/10">
                <QRCode 
                    value={addressData?.address || ''} 
                    size={140} // Tamaño reducido para evitar scroll
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                />
            </div>

            <div className="w-full">
                <p className="text-[10px] text-text-secondary uppercase font-bold mb-2 tracking-widest text-center">
                    Dirección de Billetera ({protocol})
                </p>
                
                {/* CONTENEDOR WALLET VISIBLE */}
                <div onClick={copyToClipboard} className="bg-background/80 p-3 rounded-xl border border-accent/30 flex items-center justify-between gap-2 cursor-pointer group hover:bg-background hover:border-accent transition-all shadow-inner">
                    <p className="text-[11px] font-mono text-white break-all text-center flex-1 leading-snug">
                        {addressData?.address}
                    </p>
                    <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                        <HiOutlineClipboardDocument className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* ADVERTENCIAS */}
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <HiExclamationTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-200/80 leading-relaxed">
                <strong className="text-yellow-500 block mb-0.5 uppercase font-bold">¡Importante!</strong>
                Asegúrate de que la red coincida con <strong>{protocol}</strong>.
            </p>
        </div>
        
        {addressData?.type === 'dynamic' ? (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                <HiShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-[10px] text-green-200/80">
                    <strong>Automático:</strong> Acreditación tras 1 confirmación.
                </p>
            </div>
        ) : (
            <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <HiShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="text-[10px] text-blue-200/80">
                    <strong>Monitoreado:</strong> Puede tardar 5-15 min.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DepositAddressPage;