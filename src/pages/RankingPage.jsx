// RUTA: frontend/src/pages/RankingPage.jsx (DISEÑO CRISTALINO)

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import Loader from '../components/common/Loader';
import { HiTrophy } from 'react-icons/hi2';

// Subcomponente para una fila del ranking con diseño cristalino
const RankingItem = ({ rank, user, score }) => {
    const rankColors = {
        1: 'text-yellow-400',
        2: 'text-slate-400',
        3: 'text-orange-400',
    };
    const rankColorClass = rankColors[rank] || 'text-text-tertiary';

    return (
        <div className="flex items-center p-3 bg-card/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-subtle">
            <div className={`w-10 text-lg font-bold flex-shrink-0 text-center ${rankColorClass}`}>
                #{rank}
            </div>
            <img 
                src={user.photoUrl || '/assets/images/user-avatar-placeholder.png'} 
                alt={user.username} 
                className="w-10 h-10 rounded-full object-cover mx-2 border-2 border-card"
            />
            <div className="flex-grow overflow-hidden">
                <p className="font-semibold text-text-primary truncate">{user.username || 'Usuario Anónimo'}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
                <p className="font-bold text-accent-secondary">{score.toFixed(2)}</p>
                <p className="text-xs text-text-secondary">USDT</p>
            </div>
        </div>
    );
};

// Subcomponente para la tarjeta de resumen del usuario con diseño cristalino
const UserSummaryCard = ({ summary }) => {
    const { t } = useTranslation();
    if (!summary || !summary.rank) {
        return (
             <div className="bg-card/70 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-subtle text-center text-text-secondary">
                {t('rankingPage.notRanked', 'No estás clasificado en este ranking.')}
            </div>
        )
    }

    return (
        <div className="bg-card/70 backdrop-blur-md p-4 rounded-2xl border-2 border-accent-primary shadow-medium">
            <p className="text-sm uppercase text-accent-primary font-bold text-center mb-2">{t('rankingPage.yourPosition', 'Tu Posición')}</p>
            <div className="flex justify-around items-center text-center">
                <div>
                    <p className="text-text-secondary text-sm">{t('rankingPage.rank', 'Rango')}</p>
                    <p className="text-3xl font-bold text-text-primary">#{summary.rank}</p>
                </div>
                <div>
                    <p className="text-text-secondary text-sm">{t('rankingPage.earnings', 'Ganancias')}</p>
                    <p className="text-3xl font-bold text-accent-secondary">{summary.score.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

const RankingPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('global');
  const [rankingData, setRankingData] = useState({ ranking: [], userSummary: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/ranking?type=${activeTab}`);
        setRankingData(response.data);
      } catch (err) {
        setError(t('rankingPage.error', 'No se pudo cargar el ranking.'));
        setRankingData({ ranking: [], userSummary: {} });
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [activeTab, t]);

  const TabButton = ({ tabName, label }) => (
    <button 
        onClick={() => setActiveTab(tabName)} 
        className={`w-1/2 py-2 text-sm font-bold rounded-lg transition-all duration-300
        ${activeTab === tabName 
            ? 'bg-accent-primary text-white shadow-subtle' 
            : 'text-text-secondary hover:bg-card/50'
        }`}
    >
      {label}
    </button>
  );

  return (
    <motion.div 
        className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary flex items-center justify-center gap-2">
            <HiTrophy className="text-accent-primary"/>
            {t('rankingPage.title', 'Ranking de Ganancias')}
        </h1>
        <p className="text-text-secondary mt-1">{t('rankingPage.subtitle', 'Compite y demuestra quién es el mejor.')}</p>
      </div>

      <div className="flex p-1 bg-card/70 backdrop-blur-md border border-white/20 rounded-xl shadow-subtle">
        <TabButton tabName="global" label={t('rankingPage.tabs.global', 'Global')} />
        <TabButton tabName="team" label={t('rankingPage.tabs.team', 'Equipo')} />
      </div>

      <AnimatePresence>
        {!loading && !error && <motion.div initial={{opacity: 0}} animate={{opacity: 1}}><UserSummaryCard summary={rankingData.userSummary} /></motion.div>}
      </AnimatePresence>
      
      <div className="flex-grow">
        {loading ? ( <div className="pt-8"><Loader /></div> ) 
         : error ? ( <div className="bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center text-status-danger border border-white/20 shadow-subtle">{error}</div> ) 
         : ( 
            <div className="space-y-2">
                {rankingData.ranking.length > 0 ? rankingData.ranking.map((item, index) => (
                    <RankingItem key={item.user._id || index} rank={index + 1} user={item.user} score={item.score} />
                )) : (
                    <div className="bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center text-text-secondary border border-white/20 shadow-subtle">{t('rankingPage.noData', 'No hay datos disponibles en este ranking.')}</div>
                )}
            </div>
          )}
      </div>
    </motion.div>
  );
};

export default RankingPage;