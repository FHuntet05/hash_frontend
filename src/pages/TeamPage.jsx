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

    // Componente de Pestaña Mejorado (Segmented Control Look)
  const TabButton = ({ level, label }) => {
      const isActive = activeTab === level;
      return (
          <button
              onClick={() => setActiveTab(level)}
              className={`
                  relative flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 z-10
                  ${isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'}
              `}
          >
              {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-surface border border-white/10 shadow-sm rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
              )}
              {label}
          </button>
      );
  };

  return (
    <motion.div className="flex flex-col h-full p-4 pt-6 pb-32 gap-6 overflow-y-auto no-scrollbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* ... (Sección Superior igual: Enlace y Stats) ... */}

      {/* --- SECCIÓN DE TABS MEJORADA --- */}
      <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-bold text-white">Detalles por Nivel</h2>
            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                {levelDetails.length} Referidos
            </span>
          </div>
          
          {/* Contenedor de Tabs Estilo iOS/Segmented */}
          <div className="flex p-1 bg-background/50 rounded-xl border border-white/5 mb-4 backdrop-blur-sm">
              <TabButton level={1} label="Nivel 1 (Directos)" />
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