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

// --- ⚠️ CONFIGURACIÓN DE TUS BILLETERAS FIJAS ⚠️ ---
// REEMPLAZA ESTAS DIRECCIONES CON LAS TUYAS REALES
const HARDCODED_WALLETS = {
    'BNB':        '0xTuWalletBNB_Aqui_xxxxxxxxxxxxxxxxxxxxxx',      // Tu Wallet BNB (BEP20)
    'USDT-TRC20': 'TJTuWalletTronUSDT_Aqui_xxxxxxxxxxxxxxxxx',      // Tu Wallet USDT (TRC20)
    'TRX':        'TJTuWalletTronTRX_Aqui_xxxxxxxxxxxxxxxxxx',      // Tu Wallet TRX (Igual a la de arriba usualmente)
};

const DepositAddressPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recibimos el protocolo seleccionado
  const { protocol } = location.state || { protocol: 'USDT-BEP20' };

  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        
        // --- LÓGICA DE SELECCIÓN ---
        
        if (protocol === 'USDT-BEP20') {
            // CASO 1: USDT BEP20 -> SIEMPRE DINÁMICA (API)
            const { data } = await api.post('/payment/generate-address', { chain: 'BSC' });
            setAddressData({ address: data.address, type: 'dynamic', currency: 'USDT' });
        
        } else {
            // CASO 2: RESTO -> HARDCODED (BNB, TRX, USDT-TRC20)
            const staticAddress = HARDCODED_WALLETS[protocol];
            
            if (staticAddress) {
                // Pequeño delay para que se sienta que "carga"
                await new Promise(r => setTimeout(r, 600)); 
                setAddressData({ address: staticAddress, type: 'static', currency: protocol });
            } else {
                toast.error(`Error: Billetera para ${protocol} no configurada`);
                navigate(-1);
            }
        }

      } catch (error) {
        toast.error('Error de conexión con el servidor');
        console.error(error);
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

  if (loading) return <div className="h-full flex items-center justify-center"><Loader text={`Preparando bóveda ${protocol}...`} /></div>;

  return (
    <div className="flex flex-col h-full p-4 pt-8 pb-20 overflow-y-auto no-scrollbar">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center text-text-secondary hover:text-white mb-4 text-sm transition-colors">
        <HiChevronLeft className="w-4 h-4 mr-1" /> Volver a selección
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">Depósito {protocol}</h1>
      <p className="text-sm text-text-secondary mb-6">
        Envía únicamente <span className="text-accent font-bold">{protocol}</span> a esta dirección.
      </p>

      {/* TARJETA QR */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-3xl p-6 border border-border shadow-2xl relative overflow-hidden"
      >
        {/* Fondo Decorativo */}
        <HiQrCode className="absolute -top-10 -right-10 w-40 h-40 text-white/5 rotate-12" />

        <div className="flex flex-col items-center relative z-10">
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border-4 border-white/10">
                <QRCode value={addressData?.address || ''} size={180} />
            </div>

            <div className="w-full">
                <p className="text-[10px] text-text-secondary uppercase font-bold mb-2 tracking-widest text-center">
                    Dirección de Billetera ({protocol})
                </p>
                <div onClick={copyToClipboard} className="bg-background/80 p-4 rounded-xl border border-accent/30 flex items-center justify-between gap-3 cursor-pointer group hover:bg-background hover:border-accent transition-all shadow-inner">
                    <p className="text-xs font-mono text-white break-all text-center flex-1 leading-relaxed">
                        {addressData?.address}
                    </p>
                    <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                        <HiOutlineClipboardDocument className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* ADVERTENCIAS INTELIGENTES */}
      <div className="mt-6 space-y-3">
        
        {/* Advertencia Crítica General */}
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <HiExclamationTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-200/80 leading-relaxed">
                <strong className="text-yellow-500 block mb-1 uppercase font-bold">¡Importante!</strong>
                Asegúrate de que la red seleccionada en tu billetera coincida con <strong>{protocol}</strong>. Los errores de red son irreversibles.
            </p>
        </div>
        
        {/* Mensaje según tipo de dirección */}
        {addressData?.type === 'dynamic' ? (
            // MENSAJE PARA USDT BEP20 (AUTOMÁTICO)
            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <HiShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                <p className="text-xs text-green-200/80">
                    <strong>Sistema Automático:</strong> Tu depósito se acreditará en segundos tras 1 confirmación de red.
                </p>
            </div>
        ) : (
            // MENSAJE PARA WALLETS FIJAS (MANUALES)
            <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <HiShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                <p className="text-xs text-blue-200/80">
                    <strong>Validación de Red:</strong> Este depósito es monitoreado por nuestro sistema central. Puede tomar entre 5 a 15 minutos en reflejarse.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DepositAddressPage;