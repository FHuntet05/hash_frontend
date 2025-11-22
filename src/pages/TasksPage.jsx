import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiTrophy, HiSparkles } from 'react-icons/hi2';
import TaskCenter from '../components/home/TaskCenter';

// Si tenías el import aquí para algo, esta es la ruta correcta:
// import { useTaskLogic } from '../hooks/useTaskLogic'; 

const TasksPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex flex-col h-full w-full px-2 pt-10 pb-32 gap-6 overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- HEADER DE MISIONES --- */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-medium relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20">
                        <HiTrophy className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-yellow-500 tracking-widest uppercase bg-yellow-500/5 px-2 py-1 rounded">
                        Reward Center
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-white mt-2">{t('tasksPage.title', 'Misiones')}</h1>
                <p className="text-xs text-text-secondary max-w-[200px]">
                    Completa objetivos y desbloquea recompensas en USDT.
                </p>
            </div>
            
            {/* Icono decorativo grande */}
            <HiSparkles className="w-24 h-24 text-yellow-500 opacity-5 absolute -right-4 -bottom-4 rotate-12" />
        </div>
      </div>
      
      {/* --- LISTA DE TAREAS --- */}
      <div className="flex-1">
          <TaskCenter />
      </div>

    </motion.div>
  );
};

export default TasksPage;