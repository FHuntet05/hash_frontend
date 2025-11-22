import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiTrophy, HiSparkles } from 'react-icons/hi2';
import TaskCenter from '../components/home/TaskCenter';

const TasksPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      // 1. px-2: Ancho completo visual.
      // 2. pt-10: Espacio superior para evitar corte en celulares.
      className="flex flex-col h-full w-full px-2 pt-10 pb-32 gap-6 overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- HEADER DE MISIONES (Aumentado Verticalmente) --- */}
      {/* 
          CAMBIOS: 
          - py-10: Relleno vertical alto.
          - min-h-[220px]: Fuerza una altura mínima considerable.
          - justify-center: Centra el contenido verticalmente.
      */}
      <div className="bg-surface rounded-3xl px-6 py-10 border border-border shadow-medium relative overflow-hidden min-h-[220px] flex flex-col justify-center">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col gap-4">
                {/* Badge y Icono */}
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                        <HiTrophy className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase bg-yellow-500/5 px-3 py-1 rounded-full border border-yellow-500/10">
                        Reward Center
                    </span>
                </div>
                
                {/* Textos Grandes */}
                <div>
                    <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-md">
                        {t('tasksPage.title', 'Misiones')}
                    </h1>
                    <p className="text-sm text-text-secondary mt-2 max-w-[240px] leading-relaxed">
                        Completa objetivos estratégicos y desbloquea recompensas en USDT.
                    </p>
                </div>
            </div>
            
            {/* Icono decorativo Gigante (Fondo) */}
            <HiSparkles className="w-40 h-40 text-yellow-500 opacity-5 absolute -right-8 -bottom-10 rotate-12 pointer-events-none" />
        </div>
      </div>
      
      {/* --- LISTA DE TAREAS --- */}
      <div className="flex-1 w-full">
          <TaskCenter />
      </div>

    </motion.div>
  );
};

export default TasksPage;