import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
    HiOutlineUserGroup, HiOutlineBanknotes, 
    HiOutlineClipboardDocument, HiUserCircle,
    HiShare
} from 'react-icons/hi2';

import TeamStatCard from '../components/team/TeamStatCard';
import SocialShare from '../components/team/SocialShare';
import Loader from '../components/common/Loader';

const TeamPage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  
  // Estados
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [levelDetails, setLevelDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Estado de carga inicial de datos
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Cargar Datos Generales
  useEffect(() => {
    const fetchData = async () => {
        try {
            const summaryRes = await api.get('/team/summary');
            setSummary(summaryRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingData(false);
        }
    };
    if (user) fetchData();
  }, [user]);

  // Cargar Detalles por Nivel cuando cambia la pestaña
  useEffect(() => {
      const fetchLevelDetails = async () => {
          setLoadingDetails(true);
          try {
              const response = await api.get(`/team/level-details/${activeTab}`);
              setLevelDetails(response.data.members || []);
          } catch (error) {
              setLevelDetails([]);
          } finally {
              setLoadingDetails(false);
          }
      };
      fetchLevelDetails();
  }, [activeTab]);

  // Lógica de copiado
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const referralLink = user?.referralCode ? `https://t.me/${botUsername}?start=${user.referralCode}` : '';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('¡Enlace copiado!');
  };

  // Componente de Tab (Pestaña)
  const TabButton = ({ level, label }) => {
      const isActive = activeTab === level;
      return (
          <button
              onClick={() => setActiveTab(level)}
              className={`
                  relative flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 z-10
                  ${isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'}
              `}
          >
              {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-surface border border-accent/50 shadow-[0_0_10px_rgba(249,115,22,0.2)] rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
              )}
              {label}
          </button>
      );
  };

  return (
    <motion.div 
        // CORRECCIÓN AQUÍ: Cambiado pt-6 a pt-10 para evitar el corte superior
        className="flex flex-col h-full p-4 pt-10 pb-32 gap-6 overflow-y-auto no-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
      {/* --- SECCIÓN SUPERIOR: CARD DE INVITACIÓN --- */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-medium relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full -mr-6 -mt-6 blur-md"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/5 rounded-tr-full -ml-5 -mb-5 blur-md"></div>

        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent border border-accent/20">
                    <HiShare className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white leading-tight">{t('teamPage.title', 'Invita a tus Amigos')}</h1>
                    <p className="text-xs text-text-secondary mt-0.5">Expande tu red y gana comisiones.</p>
                </div>
            </div>
            
            {/* Input de Enlace con estilo Neon */}
            <div className="flex items-center bg-background rounded-xl p-1.5 border border-white/10 group focus-within:border-accent/50 transition-colors shadow-inner">
                <div className="flex-1 px-3 py-2 overflow-hidden">
                     <p className="text-[10px] text-text-secondary uppercase font-bold mb-0.5 tracking-wider">Tu Enlace Único</p>
                     <input 
                        type="text" 
                        value={referralLink} 
                        readOnly 
                        className="w-full bg-transparent text-white text-xs font-mono outline-none truncate" 
                     />
                </div>
                <button 
                    onClick={copyToClipboard} 
                    className="p-3 bg-accent text-white rounded-lg hover:bg-accent-hover active:scale-95 transition-all shadow-lg shadow-accent/20"
                >
                    <HiOutlineClipboardDocument className="w-5 h-5" />
                </button>
            </div>

            {/* Social Share */}
            <div className="mt-5 pt-4 border-t border-white/5">
                 <SocialShare referralLink={referralLink} />
            </div>
        </div>
      </div>

      {/* --- STATS GRID (Resumen) --- */}
      <div className="grid grid-cols-2 gap-3">
        <TeamStatCard 
            title="Miembros" 
            value={summary?.totalTeamMembers || 0} 
            icon={HiOutlineUserGroup} 
            colorClass="text-blue-400" 
        />
        <TeamStatCard 
            title="Comisiones" 
            value={(summary?.totalCommission || 0).toFixed(2)} 
            icon={HiOutlineBanknotes} 
            colorClass="text-green-400" 
        />
      </div>

      {/* --- SECCIÓN INFERIOR: TABS Y LISTA --- */}
      <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-bold text-white">Tu Red</h2>
            {levelDetails.length > 0 && (
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                    {levelDetails.length} Activos
                </span>
            )}
          </div>
          
          {/* Tab Bar (Estilo Segmented Control) */}
          <div className="flex gap-1 p-1 bg-background/50 rounded-xl border border-white/5 mb-4 backdrop-blur-sm">
              <TabButton level={1} label="Nivel 1" />
              <TabButton level={2} label="Nivel 2" />
              <TabButton level={3} label="Nivel 3" />
          </div>

          {/* Lista de Miembros */}
          <div className="bg-surface flex-1 rounded-2xl border border-border overflow-hidden min-h-[300px] relative shadow-lg">
              {loadingDetails ? (
                  <div className="absolute inset-0 flex items-center justify-center"><Loader /></div>
              ) : levelDetails.length > 0 ? (
                  <div className="divide-y divide-white/5 overflow-y-auto absolute inset-0 no-scrollbar p-1">
                      {levelDetails.map((member, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors mb-1"
                          >
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-white/10 text-text-secondary relative shrink-0">
                                      <HiUserCircle className="w-6 h-6" />
                                      {/* Indicador de estado activo */}
                                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></div>
                                  </div>
                                  <div className="min-w-0">
                                      <p className="text-sm font-bold text-white truncate max-w-[120px]">
                                          {member.username || `ID: ${member.telegramId}`}
                                      </p>
                                      <p className="text-[10px] text-text-secondary">
                                          Reg: {new Date(member.createdAt).toLocaleDateString()}
                                      </p>
                                  </div>
                              </div>
                              <div className="text-right shrink-0">
                                  <p className="text-[10px] text-text-secondary uppercase tracking-wide">Comisión</p>
                                  <p className="text-sm font-bold text-accent font-mono">
                                      +{member.commissionGenerated?.toFixed(2) || '0.00'}
                                  </p>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary opacity-50 p-6 text-center">
                      <div className="bg-background p-4 rounded-full mb-3 border border-white/5">
                          <HiOutlineUserGroup className="w-8 h-8 stroke-1" />
                      </div>
                      <p className="text-sm font-medium">Sin miembros en este nivel</p>
                      <p className="text-xs mt-1">Comparte tu enlace para crecer.</p>
                  </div>
              )}
          </div>
      </div>

    </motion.div>
  );
};

export default TeamPage;