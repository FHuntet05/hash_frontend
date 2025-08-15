// RUTA: frontend/src/pages/TeamPage.jsx (v3.3 - POLLING SIN PARPADEO)

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup, HiOutlineBanknotes, HiOutlineClipboardDocument, HiOutlineExclamationTriangle } from 'react-icons/hi2';

import TeamStatCard from '../components/team/TeamStatCard';
import TeamLevelCard from '../components/team/TeamLevelCard';
import Loader from '../components/common/Loader';
import SocialShare from '../components/team/SocialShare';

const POLLING_INTERVAL = 20000; // 20 segundos

const TeamPage = () => {
  const { t } = useTranslation();
  const { user, refreshUserData } = useUserStore();
  const [teamData, setTeamData] = useState(null);
  
  // --- INICIO DE MODIFICACIÓN: ESTADO DE CARGA SEPARADO ---
  // 'initialLoading' controla el loader grande de la primera carga.
  const [initialLoading, setInitialLoading] = useState(true);
  // --- FIN DE MODIFICACIÓN ---

  const fetchAllData = useCallback(async (isInitialLoad = false) => {
    // Ya no usamos el estado 'loading' general para evitar el parpadeo.
    try {
      const [teamResponse] = await Promise.all([
        api.get('/team/summary'),
        refreshUserData()
      ]);
      setTeamData(teamResponse.data);
    } catch (error) {
      if (isInitialLoad) {
        toast.error(t('teamPage.toasts.fetchError', 'Error al cargar datos del equipo'));
      }
      console.error("Error en polling de TeamPage:", error);
    } finally {
      // Solo desactivamos el loader grande en la carga inicial.
      if (isInitialLoad) {
        setInitialLoading(false);
      }
    }
  }, [t, refreshUserData]);

  useEffect(() => {
    if (user) {
      fetchAllData(true);
      const intervalId = setInterval(() => {
        fetchAllData(false);
      }, POLLING_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [user, fetchAllData]);

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const isEnvVarMissing = !botUsername;

  const referralLink = !isEnvVarMissing && user?.telegramId 
    ? `https://t.me/${botUsername}?start=${user.telegramId}`
    : '';
  
  const copyToClipboard = () => {
    if (isEnvVarMissing || !referralLink) {
        toast.error(t('teamPage.toasts.linkError', 'Error de configuración: no se pudo generar el enlace.'));
        return;
    }
    navigator.clipboard.writeText(referralLink);
    toast.success(t('teamPage.toasts.linkCopied', '¡Enlace de invitación copiado!'));
  };

  // --- INICIO DE MODIFICACIÓN: Comprobación del nuevo estado de carga ---
  if (initialLoading || !user) {
    return <div className="flex items-center justify-center h-full pt-16"><Loader /></div>;
  }
  // --- FIN DE MODIFICACIÓN ---

  const stats = [
    { 
      title: t('teamPage.stats.members', 'Miembros Totales'), 
      value: teamData?.totalTeamMembers || 0, 
      icon: HiOutlineUserGroup, 
      color: "text-accent-primary" 
    },
    { 
      title: t('teamPage.stats.commission', 'Comisión Total'), 
      value: `${(teamData?.totalCommission || 0).toFixed(2)}`, 
      icon: HiOutlineBanknotes, 
      color: "text-accent-secondary" 
    },
  ];

  return (
    <motion.div 
        className="flex flex-col gap-8 p-4 pt-6 pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-medium text-center">
        <h1 className="text-xl font-bold text-text-primary">{t('teamPage.title', 'Invita a tus Amigos')}</h1>
        <p className="text-text-secondary text-sm mt-2 mb-4">{t('teamPage.description', 'Comparte tu enlace y gana comisiones por cada miembro de tu equipo.')}</p>
        
        {isEnvVarMissing ? (
            <div className="flex items-center gap-2 bg-status-danger/10 p-3 rounded-lg text-status-danger text-sm">
                <HiOutlineExclamationTriangle className="w-6 h-6 flex-shrink-0" />
                <span>Error de configuración del administrador: El nombre de usuario del bot no está definido.</span>
            </div>
        ) : (
            <div className="flex items-center bg-background/50 rounded-lg p-2 border border-border">
              <input 
                type="text" 
                value={referralLink} 
                readOnly 
                className="w-full bg-transparent text-text-secondary text-sm outline-none" 
              />
              <button onClick={copyToClipboard} className="ml-2 p-2 rounded-md bg-accent-primary hover:bg-accent-primary-hover active:scale-95 text-white transition-colors">
                <HiOutlineClipboardDocument className="w-5 h-5" />
              </button>
            </div>
        )}
        
        <SocialShare referralLink={referralLink} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map(stat => (
          <TeamStatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} colorClass={stat.color} />
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">{t('teamPage.levelsTitle', 'Niveles del Equipo')}</h2>
        {teamData?.levels && teamData.levels.length > 0 ? (
          <div className="space-y-3">
            {teamData.levels.map(levelData => (
              <TeamLevelCard 
                key={levelData.level} 
                level={levelData.level} 
                members={levelData.totalMembers}
                totalCommission={levelData.totalCommission}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center text-text-secondary border border-white/20 shadow-subtle">
            <p>{t('teamPage.noLevelsData', 'Aún no tienes miembros en tu equipo. ¡Empieza a invitar!')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamPage;