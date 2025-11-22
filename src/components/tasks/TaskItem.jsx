import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
    HiOutlineCheckCircle, HiLockClosed, 
    HiOutlineGift, HiChevronRight, HiUserGroup 
} from 'react-icons/hi2';

const TaskItem = ({ task, onGoToTask, onClaim }) => {
  const { t } = useTranslation();
  const { status, title, description, reward, progress, target, taskId } = task;

  // Definir estilos según el estado
  const isLocked = status === 'LOCKED';
  const isClaimed = status === 'CLAIMED';
  const isReadyToClaim = status === 'COMPLETED_NOT_CLAIMED';
  const isInProgress = status === 'PENDING';

  // Icono dinámico según el tipo de tarea
  let Icon = HiOutlineGift;
  if (taskId.includes('INVITE')) Icon = HiUserGroup;

  // Porcentaje de progreso (evitar división por cero)
  const progressPercent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300
        ${isReadyToClaim 
            ? 'bg-surface border-accent/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' // Glow Naranja si está lista
            : isClaimed
                ? 'bg-surface/30 border-white/5 opacity-60' // Apagado si ya se cobró
                : 'bg-surface border-white/5' // Normal
        }
      `}
    >
      {/* --- BARRA DE PROGRESO DE FONDO (Sutil) --- */}
      {!isLocked && !isClaimed && (
         <div 
            className="absolute bottom-0 left-0 h-1 bg-accent/20 transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }}
         />
      )}

      <div className="p-4 flex items-center gap-4">
        
        {/* --- ICONO IZQUIERDO --- */}
        <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative
            ${isReadyToClaim ? 'bg-accent text-white shadow-lg' : ''}
            ${isInProgress ? 'bg-blue-500/10 text-blue-400' : ''}
            ${isLocked ? 'bg-white/5 text-text-secondary' : ''}
            ${isClaimed ? 'bg-green-500/10 text-green-500' : ''}
        `}>
            {isLocked ? <HiLockClosed className="w-6 h-6" /> : 
             isClaimed ? <HiOutlineCheckCircle className="w-6 h-6" /> : 
             <Icon className="w-6 h-6" />}
             
             {/* Notificación flotante si está lista */}
             {isReadyToClaim && (
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>
             )}
        </div>

        {/* --- CONTENIDO CENTRAL --- */}
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h3 className={`text-sm font-bold truncate ${isClaimed ? 'text-text-secondary line-through' : 'text-white'}`}>
                    {title}
                </h3>
                {/* Recompensa Badge */}
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

            {/* Indicador de Progreso (Texto y Barra visual pequeña) */}
            {!isClaimed && !isLocked && target > 0 && (
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${isReadyToClaim ? 'bg-accent' : 'bg-blue-500'}`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] font-mono text-text-secondary">
                        {progress}/{target}
                    </span>
                </div>
            )}
        </div>

        {/* --- ACCIÓN (DERECHA) --- */}
        <div className="shrink-0">
            {isReadyToClaim ? (
                <button 
                    onClick={() => onClaim(taskId)}
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-lg shadow-accent/20 transition-transform active:scale-95 animate-pulse"
                >
                    Reclamar
                </button>
            ) : isLocked ? (
                <HiLockClosed className="w-5 h-5 text-text-secondary opacity-50" />
            ) : isClaimed ? (
                <span className="text-xs font-bold text-green-500">Hecho</span>
            ) : (
                <button 
                    onClick={() => onGoToTask(task)} // Opcional: redirigir a invitar
                    className="p-2 bg-white/5 rounded-lg text-text-secondary hover:bg-white/10"
                >
                    <HiChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>

      </div>
    </motion.div>
  );
};

export default TaskItem;