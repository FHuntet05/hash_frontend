import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    HiOutlineCheckCircle, HiLockClosed, 
    HiOutlineGift, HiChevronRight, HiUserGroup, HiUserPlus 
} from 'react-icons/hi2';

const TaskItem = ({ task, onGoToTask, onClaim }) => {
  const { status, title, description, reward, progress, target, taskId, type, actionUrl } = task;
  
  // Estado local para "hackear" visualmente las tareas sociales
  const [socialUnlocked, setSocialUnlocked] = useState(false);

  const isLocked = status === 'LOCKED';
  const isClaimed = status === 'CLAIMED';
  
  // Una tarea está lista si el backend dice OK (tasks normales) O si desbloqueamos socialmente
  const isReadyToClaim = status === 'COMPLETED_NOT_CLAIMED' || (type === 'SOCIAL_LINK' && socialUnlocked);

  const handleAction = () => {
      if (type === 'SOCIAL_LINK') {
          // 1. Abrir enlace
          if (actionUrl) window.open(actionUrl, '_blank');
          // 2. Simular delay de verificación y desbloquear
          setTimeout(() => setSocialUnlocked(true), 1500);
      } else {
          // Navegar dentro de la app
          onGoToTask(task);
      }
  };

  // Iconografía
  let Icon = HiOutlineGift;
  if (taskId.includes('INVITE')) Icon = HiUserGroup;
  if (taskId.includes('DEP')) Icon = HiUserPlus; // Icono para depósitos de referidos

  // Cálculo porcentaje
  const progressPercent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300 p-4 flex items-center gap-4
        ${isReadyToClaim 
            ? 'bg-surface border-accent/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' // Resplandor Naranja
            : isClaimed
                ? 'bg-surface/30 border-white/5 opacity-60' // Apagado
                : 'bg-surface border-white/5' // Normal
        }
      `}
    >
      {/* Barra de fondo */}
      {!isLocked && !isClaimed && type !== 'SOCIAL_LINK' && (
         <div 
            className="absolute bottom-0 left-0 h-1 bg-accent/20 transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }}
         />
      )}

      {/* Icono */}
      <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center shrink-0
            ${isReadyToClaim ? 'bg-accent text-white shadow-lg animate-pulse' : ''}
            ${(!isReadyToClaim && !isClaimed) ? 'bg-white/5 text-text-secondary' : ''}
            ${isClaimed ? 'bg-green-500/10 text-green-500' : ''}
      `}>
            {isClaimed ? <HiOutlineCheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
      </div>

      {/* Textos */}
      <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h3 className={`text-sm font-bold truncate ${isClaimed ? 'text-text-secondary line-through' : 'text-white'}`}>
                    {title}
                </h3>
                {/* Badge Recompensa */}
                {!isClaimed && (
                    <span className={`
                        text-[10px] font-mono px-2 py-0.5 rounded border
                        ${isReadyToClaim 
                            ? 'bg-accent/20 text-accent border-accent/30' 
                            : 'bg-white/5 text-text-secondary border-white/10'}
                    `}>
                        +{reward} USDT
                    </span>
                )}
            </div>
            <p className="text-xs text-text-secondary mt-0.5 truncate">{description}</p>
            
            {/* Progreso numérico (Solo para no sociales) */}
            {!isClaimed && !isLocked && target > 0 && type !== 'SOCIAL_LINK' && (
                <span className="text-[10px] font-mono text-text-secondary block mt-1">
                    Progreso: {progress} / {target}
                </span>
            )}
      </div>

      {/* Botón de Acción */}
      <div className="shrink-0">
            {isReadyToClaim ? (
                <button 
                    onClick={() => onClaim(taskId)}
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-lg transition-transform active:scale-95"
                >
                    Reclamar
                </button>
            ) : isClaimed ? (
                <span className="text-xs font-bold text-green-500">Hecho</span>
            ) : (
                <button 
                    onClick={handleAction} 
                    className="p-2 bg-white/5 rounded-lg text-text-secondary hover:bg-white/10 transition-colors"
                >
                    <HiChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    </motion.div>
  );
};

export default TaskItem;