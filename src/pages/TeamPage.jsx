// RUTA: frontend/src/pages/TeamPage.jsx (SINCRONIZADO CON NUEVO TeamLevelCard Y COLORES SEMÁNTICOS)

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup, HiOutlineBanknotes, HiOutlineArrowDownTray, HiOutlineArrowUpTray, HiOutlineClipboardDocument } from 'react-icons/hi2';

import TeamStatCard from '../components/team/TeamStatCard';
import TeamLevelCard from '../components/team/TeamLevelCard';
import Loader from '../components/common/Loader';

const TeamPage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await api.get('/team/summary');
        setTeamData(response.data);
      } catch (error) {
        toast.error(t('teamPage.toasts.fetchError', 'Error al cargar datos del equipo'));
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [t]);

  const referralLink = `${window.location.origin}/register?ref=${user.telegramId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success(t('teamPage.toasts.linkCopied', 'Enlace copiado!'));
  };

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center"><Loader text={t('common.loading', 'Cargando...')} /></div>;
  }

  const stats = [
    { title: t('teamPage.stats.members'), value: teamData?.totalMembers || 0, icon: HiOutlineUserGroup, color: "text-accent-primary" },
    { title: t('teamPage.stats.commission'), value: `${(teamData?.totalCommissions?.usdt || 0).toFixed(2)}`, icon: HiOutlineBanknotes, color: "text-accent-secondary" },
    { title: t('teamPage.stats.recharge'), value: `${(teamData?.totalDeposits?.usdt || 0).toFixed(2)}`, icon: HiOutlineArrowDownTray, color: "text-text-primary" },
    { title: t('teamPage.stats.withdraw'), value: `${(teamData?.totalWithdrawals?.usdt || 0).toFixed(2)}`, icon: HiOutlineArrowUpTray, color: "text-text-primary" },
  ];

  return (
    <motion.div 
        className="flex flex-col h-full overflow-y-auto p-4 gap-8 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      {/* Bloque 1: Invitación (CTA) */}
      <div className="bg-card rounded-lg p-5 border border-border text-center shadow-lg">
        <h1 className="text-xl font-bold text-text-primary">{t('teamPage.title', 'Invita a tus Amigos')}</h1>
        <p className="text-text-secondary text-sm mt-2 mb-4">{t('teamPage.description', 'Comparte tu enlace y gana comisiones por cada miembro.')}</p>
        <div className="flex items-center bg-background rounded-md p-2 border border-border">
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
      </div>

      {/* Bloque 2: Estadísticas Generales */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(stat => (
          <TeamStatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} colorClass={stat.color} />
        ))}
      </div>

      {/* Bloque 3: Niveles de Equipo */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">{t('teamPage.levelsTitle', 'Niveles del Equipo')}</h2>
        {teamData?.levels && teamData.levels.length > 0 ? (
          <div className="space-y-3">
            {teamData.levels.map(levelData => (
              <TeamLevelCard 
                key={levelData.level} 
                level={levelData.level} 
                members={levelData.count} 
                validMembers={levelData.validCount}
                // NOTA DE ARQUITECTURA: Pasando la nueva prop 'totalCommission'.
                // El backend DEBE ser actualizado para proveer este campo en la respuesta de /team/summary.
                totalCommission={levelData.totalCommission}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg p-8 text-center text-text-tertiary border border-border">
            <p>{t('teamPage.noTeamMembers', 'Aún no tienes miembros en tu equipo.')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamPage;