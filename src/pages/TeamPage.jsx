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
import SocialShare from '../components/team/SocialShare'; // Asegúrate de que este componente use los estilos heredados o adáptalo
import Loader from '../components/common/Loader';

const TeamPage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  
  // Estados
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [levelDetails, setLevelDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Ya no bloqueamos toda la página con un loading global, solo las partes dinámicas
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Cargar Datos
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

  // Cargar Detalles por Nivel
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
        className="flex flex-col h-full p-4 pt-6 pb-32 gap-6 overflow-y-auto no-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
      {/* --- SECCIÓN SUPERIOR: ENLACE Y SOCIAL --- */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-medium relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full -mr-5 -mt-5"></div>

        <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <HiShare className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white">{t('teamPage.title', 'Invita a tus Amigos')}</h1>
                <p className="text-xs text-text-secondary">Gana comisiones de hasta 3 niveles.</p>
            </div>
        </div>
        
        {/* Input de Enlace con estilo Neon */}
        <div className="flex items-center bg-background rounded-xl p-1.5 border border-white/10 mt-4 group focus-within:border-accent/50 transition-colors">
            <div className="flex-1 px-3 py-2 overflow-hidden">
                 <p className="text-[10px] text-text-secondary uppercase font-bold mb-0.5">Tu Enlace Único</p>
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

        {/* Componente Social Share (Asegúrate de que sus iconos se vean bien sobre fondo oscuro) */}
        <div className="mt-4 pt-4 border-t border-white/5">
             <SocialShare referralLink={referralLink} />
        </div>
      </div>

      {/* --- STATS GRID --- */}
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

      {/* --- SECCIÓN DE TABS Y LISTA --- */}
      <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-bold text-white">Tu Red</h2>
            {levelDetails.length > 0 && (
                <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                    {levelDetails.length} Activos
                </span>
            )}
          </div>
          
          {/* Tab Bar */}
          <div className="flex gap-1 p-1 bg-background/50 rounded-xl border border-white/5 mb-4 backdrop-blur-sm">
              <TabButton level={1} label="Nivel 1" />
              <TabButton level={2} label="Nivel 2" />
              <TabButton level={3} label="Nivel 3" />
          </div>

          {/* Lista de Miembros */}
          <div className="bg-surface flex-1 rounded-2xl border border-border overflow-hidden min-h-[250px] relative">
              {loadingDetails ? (
                  <div className="absolute inset-0 flex items-center justify-center"><Loader /></div>
              ) : levelDetails.length > 0 ? (
                  <div className="divide-y divide-white/5 overflow-y-auto absolute inset-0 no-scrollbar">
                      {levelDetails.map((member, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                          >
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-white/10 text-text-secondary relative">
                                      <HiUserCircle className="w-6 h-6" />
                                      {/* Indicador de estado (simulado) */}
                                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></div>
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-white">
                                          {member.username || `ID: ${member.telegramId}`}
                                      </p>
                                      <p className="text-[10px] text-text-secondary">
                                          Reg: {new Date(member.createdAt).toLocaleDateString()}
                                      </p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-[10px] text-text-secondary uppercase">Comisión</p>
                                  <p className="text-sm font-bold text-accent font-mono">
                                      +{member.commissionGenerated?.toFixed(2) || '0.00'}
                                  </p>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary opacity-50">
                      <HiOutlineUserGroup className="w-12 h-12 mb-2 stroke-1" />
                      <p className="text-sm">Sin miembros en este nivel</p>
                  </div>
              )}
          </div>
      </div>

    </motion.div>
  );
};

export default TeamPage;