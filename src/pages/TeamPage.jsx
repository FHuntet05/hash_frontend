import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HiOutlineUserGroup, HiOutlineBanknotes, 
    HiOutlineClipboardDocument, HiUserCircle 
} from 'react-icons/hi2';

import TeamStatCard from '../components/team/TeamStatCard';
import SocialShare from '../components/team/SocialShare';
import Loader from '../components/common/Loader';

const TeamPage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  
  // Estados
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState(1); // Pestaña activa (1, 2, 3)
  const [levelDetails, setLevelDetails] = useState([]); // Lista de usuarios del nivel actual
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // 1. Cargar Resumen General (Cabecera)
  useEffect(() => {
    const fetchSummary = async () => {
        try {
            const response = await api.get('/team/summary');
            setSummary(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSummary(false);
        }
    };
    if (user) fetchSummary();
  }, [user]);

  // 2. Cargar Detalles cuando cambia la Pestaña
  useEffect(() => {
      const fetchLevelDetails = async () => {
          setLoadingDetails(true);
          try {
              // Llamamos al endpoint específico por nivel
              const response = await api.get(`/team/level-details/${activeTab}`);
              // Asumiendo que el backend devuelve { members: [...] }
              setLevelDetails(response.data.members || []);
          } catch (error) {
              console.error("Error cargando detalles de nivel:", error);
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

  if (loadingSummary) return <div className="flex justify-center pt-20"><Loader /></div>;

  // Componente de Pestaña
  const TabButton = ({ level, label }) => (
      <button
          onClick={() => setActiveTab(level)}
          className={`
              flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200
              ${activeTab === level 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'bg-surface text-text-secondary hover:bg-surface/80'
              }
          `}
      >
          {label}
      </button>
  );

  return (
    <motion.div 
        className="flex flex-col h-full p-4 pt-6 pb-28 gap-6 overflow-y-auto no-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
      {/* --- SECCIÓN SUPERIOR: ENLACE Y ESTADÍSTICAS --- */}
      <div className="bg-surface rounded-2xl p-5 border border-border shadow-medium">
        <h1 className="text-xl font-bold text-white mb-2">{t('teamPage.title', 'Equipo')}</h1>
        <p className="text-xs text-text-secondary mb-4">Gestiona tu red de referidos y comisiones.</p>
        
        {/* Input de Enlace */}
        <div className="flex items-center bg-background rounded-xl p-2 border border-border mb-4">
            <input type="text" value={referralLink} readOnly className="w-full bg-transparent text-text-secondary text-xs outline-none px-2 font-mono" />
            <button onClick={copyToClipboard} className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-colors">
                <HiOutlineClipboardDocument className="w-5 h-5" />
            </button>
        </div>
        <SocialShare referralLink={referralLink} />
      </div>

      {/* Stats Grid */}
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

      {/* --- SECCIÓN INFERIOR: PESTAÑAS Y LISTA --- */}
      <div>
          <h2 className="text-lg font-bold text-white mb-3">Detalles por Nivel</h2>
          
          {/* Tab Bar */}
          <div className="flex gap-2 mb-4 bg-background p-1 rounded-2xl border border-border">
              <TabButton level={1} label="Nivel 1" />
              <TabButton level={2} label="Nivel 2" />
              <TabButton level={3} label="Nivel 3" />
          </div>

          {/* Lista de Miembros */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden min-h-[200px]">
              {loadingDetails ? (
                  <div className="flex justify-center py-10"><Loader /></div>
              ) : levelDetails.length > 0 ? (
                  <div className="divide-y divide-border">
                      {levelDetails.map((member, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                          >
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border text-text-secondary">
                                      <HiUserCircle className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-white">
                                          {member.username || `Usuario ${member.telegramId?.substring(0,5)}...`}
                                      </p>
                                      <p className="text-[10px] text-text-secondary">
                                          Unido: {new Date(member.createdAt).toLocaleDateString()}
                                      </p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-xs text-text-secondary">Comisión</p>
                                  <p className="text-sm font-bold text-accent">
                                      +{member.commissionGenerated?.toFixed(4) || '0.00'}
                                  </p>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-text-secondary">
                      <HiOutlineUserGroup className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm">No hay miembros en este nivel.</p>
                  </div>
              )}
          </div>
      </div>

    </motion.div>
  );
};

export default TeamPage;