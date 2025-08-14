// RUTA: frontend/src/pages/TeamPage.jsx (v2.0 - SINCRONIZADO CON NUEVA API)

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup, HiOutlineBanknotes, HiOutlineClipboardDocument } from 'react-icons/hi2';

import TeamStatCard from '../components/team/TeamStatCard';
import TeamLevelCard from '../components/team/TeamLevelCard';
import Loader from '../components/common/Loader';
import SocialShare from '../components/team/SocialShare';

const TeamPage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true); // Se activa el loader al empezar
      try {
        const response = await api.get('/team/summary');
        setTeamData(response.data);
      } catch (error) {
        toast.error(t('teamPage.toasts.fetchError', 'Error al cargar datos del equipo'));
      } finally {
        setLoading(false);
      }
    };
    if (user) { // Solo se ejecuta si el usuario está disponible
        fetchTeamData();
    }
  }, [t, user]);

  const referralLink = `${window.location.origin}/register?ref=${user?.telegramId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success(t('teamPage.toasts.linkCopied', 'Enlace de invitación copiado!'));
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center h-full pt-16"><Loader /></div>;
  }

  // --- INICIO DE MODIFICACIÓN: Adaptar a la nueva estructura de datos de la API ---
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
    // Los stats de recarga y retiro se eliminan para coincidir con la API simplificada
  ];
  // --- FIN DE MODIFICACIÓN ---

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
            {/* --- INICIO DE MODIFICACIÓN: Pasar props correctas a TeamLevelCard --- */}
            {teamData.levels.map(levelData => (
              <TeamLevelCard 
                key={levelData.level} 
                level={levelData.level} 
                members={levelData.totalMembers} // Se usa 'totalMembers'
                totalCommission={levelData.totalCommission} // Se pasa la nueva propiedad
                // Se elimina 'validMembers'
              />
            ))}
            {/* --- FIN DE MODIFICACIÓN --- */}
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