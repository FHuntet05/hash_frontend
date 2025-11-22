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

// --- CONFIGURACIÓN DE WALLETS FIJAS (HARDCODED) ---
// Cambia estas direcciones por las tuyas reales
const HARDCODED_WALLETS = {
    'TRC20': 'TVJ5...TU_WALLET_TRC20_AQUI...xyz', 
    // Puedes agregar más redes aquí si lo necesitas
};

const DepositAddressPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { networkId, protocol } = location.state || { networkId: 'usdt_bep20', protocol: 'BEP20' };

  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        // --- LÓGICA HÍBRIDA ---
        if (protocol === 'BEP20') {
            // CASO 1: BEP20 -> Generación Dinámica por API
            const { data } = await api.post('/payment/generate-address', { chain: 'BSC' });
            setAddressData({ address: data.address, type: 'dynamic' });
        } else {
            // CASO 2: TRC20 u otros -> Wallet Fija
            const staticAddress = HARDCODED_WALLETS[protocol];
            if (staticAddress) {
                // Simulamos un pequeño delay para consistencia visual
                await new Promise(r => setTimeout(r, 800)); 
                setAddressData({ address: staticAddress, type: 'static' });
            } else {
                toast.error('Red no configurada');
                navigate(-1);
            }
        }
      } catch (error) {
        toast.error('Error de conexión con bóveda');
        console.error(error);
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

  if (loading) return <div className="h-full flex items-center justify-center"><Loader text={`Conectando a red ${protocol}...`} /></div>;

  return (
    <div className="flex flex-col h-full p-4 pt-8 pb-20 overflow-y-auto no-scrollbar">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center text-text-secondary hover:text-white mb-4 text-sm">
        <HiChevronLeft className="w-4 h-4 mr-1" /> Volver a redes
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">Depósito {protocol}</h1>
      <p className="text-sm text-text-secondary mb-6">Envía solamente USDT a través de la red <span className="text-accent font-bold">{protocol}</span>.</p>

      {/* TARJETA QR */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-3xl p-6 border border-border shadow-2xl relative overflow-hidden"
      >
        <HiQrCode className="absolute -top-10 -right-10 w-40 h-40 text-white/5 rotate-12" />

        <div className="flex flex-col items-center relative z-10">
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border-4 border-white/10">
                <QRCode value={addressData?.address || ''} size={180} />
            </div>

            <div className="w-full">
                <p className="text-[10px] text-text-secondary uppercase font-bold mb-2 tracking-widest text-center">
                    Dirección de Billetera
                </p>
                <div onClick={copyToClipboard} className="bg-background/80 p-4 rounded-xl border border-accent/30 flex items-center justify-between gap-3 cursor-pointer group hover:bg-background hover:border-accent transition-all">
                    <p className="text-xs font-mono text-white break-all text-center flex-1">
                        {addressData?.address}
                    </p>
                    <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                        <HiOutlineClipboardDocument className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* ADVERTENCIAS DINÁMICAS */}
      <div className="mt-6 space-y-3">
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <HiExclamationTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-200/80 leading-relaxed">
                <strong className="text-yellow-500 block mb-1 uppercase font-bold">¡Atención Crítica!</strong>
                Estás en la red <strong>{protocol}</strong>. Enviar fondos por otra red resultará en la pérdida permanente.
            </p>
        </div>
        
        {/* Mensaje específico según si es Automático (BEP20) o Manual (TRC20) */}
        {protocol === 'BEP20' ? (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <HiShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                <p className="text-xs text-green-200/80">
                    Sistema automático. Se acreditará tras 1 confirmación.
                </p>
            </div>
        ) : (
            <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <HiShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                <p className="text-xs text-blue-200/80">
                    Depósito monitoreado. Puede tomar unos minutos en reflejarse.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DepositAddressPage;