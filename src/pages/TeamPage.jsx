// RUTA: frontend/src/pages/TeamPage.jsx (REDISEÑO COMPLETO "MEGA FÁBRICA")

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
        toast.error(t('teamPage.toasts.fetchError'));
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [t]);

  const referralLink = `${window.location.origin}/register?ref=${user.telegramId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success(t('teamPage.toasts.linkCopied'));
  };

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center"><Loader text={t('common.loading')} /></div>;
  }

  const stats = [
    { title: t('teamPage.stats.members'), value: teamData?.totalMembers || 0, icon: HiOutlineUserGroup, color: "text-sky-400" },
    { title: t('teamPage.stats.commission'), value: `${(teamData?.totalCommissions?.usdt || 0).toFixed(2)}`, icon: HiOutlineBanknotes, color: "text-lime-400" },
    { title: t('teamPage.stats.recharge'), value: `${(teamData?.totalDeposits?.usdt || 0).toFixed(2)}`, icon: HiOutlineArrowDownTray, color: "text-slate-50" },
    { title: t('teamPage.stats.withdraw'), value: `${(teamData?.totalWithdrawals?.usdt || 0).toFixed(2)}`, icon: HiOutlineArrowUpTray, color: "text-slate-50" },
  ];

  return (
    <motion.div 
        className="flex flex-col h-full overflow-y-auto p-4 gap-8 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      {/* Bloque 1: Invitación (CTA) */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 text-center shadow-lg">
        <h1 className="text-xl font-bold text-slate-50">{t('teamPage.title', 'Invita a tus Amigos')}</h1>
        <p className="text-slate-400 text-sm mt-2 mb-4">{t('teamPage.description', 'Comparte tu enlace y gana comisiones por cada miembro.')}</p>
        <div className="flex items-center bg-slate-900 rounded-md p-2 border border-slate-600">
          <input 
            type="text" 
            value={referralLink} 
            readOnly 
            className="w-full bg-transparent text-slate-400 text-sm outline-none" 
          />
          <button onClick={copyToClipboard} className="ml-2 p-2 rounded-md bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white transition-colors">
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
        <h2 className="text-lg font-semibold text-slate-50 mb-4">{t('teamPage.levelsTitle', 'Niveles del Equipo')}</h2>
        {teamData?.levels && teamData.levels.length > 0 ? (
          <div className="space-y-3">
            {teamData.levels.map(levelData => (
              <TeamLevelCard 
                key={levelData.level} 
                level={levelData.level} 
                members={levelData.count} 
                validMembers={levelData.validCount}
                commissionRate={levelData.commissionRate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-500 border border-slate-700">
            <p>{t('teamPage.noTeamMembers', 'Aún no tienes miembros en tu equipo.')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamPage;