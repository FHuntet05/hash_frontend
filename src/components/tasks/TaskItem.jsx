// --- START OF FILE TaskItem.jsx ---

// RUTA: frontend/src/components/tasks/TaskItem.jsx (v3.1 - EFECTO GLASSMORPHISM)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiCheckCircle, HiGift, HiUsers, HiLockClosed } from 'react-icons/hi2';

const TaskItem = ({ task, onClaim }) => {
    const { t } = useTranslation();
    const { taskId, title, description, reward, status, progress, target } = task;

    const isInviteTask = taskId.startsWith('INVITE_');
    const percentage = target > 0 ? Math.min(100, (progress / target) * 100) : 0;

    const renderButton = () => {
        switch (status) {
            case 'CLAIMED':
                return <div className="bg-status-success/10 text-status-success text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2"><HiCheckCircle /> {t('tasks.claimed', 'Reclamado')}</div>;
            case 'COMPLETED_NOT_CLAIMED':
                return <motion.button whileTap={{ scale: 0.95 }} onClick={() => onClaim(taskId)} className="bg-accent text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-accent-hover animate-pulse shadow-lg shadow-accent/20">{t('tasks.claim', 'Reclamar')}</motion.button>;
            case 'LOCKED':
                return <div className="bg-background text-text-secondary text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2 border border-border"><HiLockClosed /> {t('tasks.locked', 'Bloqueado')}</div>;
            case 'PENDING':
            default:
                return <button disabled className="bg-surface text-text-secondary text-sm font-semibold px-4 py-1.5 rounded-lg cursor-not-allowed border border-border">{t('tasks.pending', 'En Progreso')}</button>;
        }
    };

    return (
        // --- INICIO DE MODIFICACIÓN CRÍTICA: Se aplica el efecto Glass ---
        <motion.div 
            className="bg-surface/50 backdrop-blur-md rounded-2xl p-4 border border-border flex flex-col space-y-4 shadow-subtle" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
        >
        {/* --- FIN DE MODIFICACIÓN CRÍTICA --- */}

            <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-4">
                  <div className="bg-background p-3 rounded-full text-accent text-2xl border border-border"><HiUsers /></div>
                  <div>
                    <h3 className="font-bold text-text-primary">{title}</h3>
                    <p className="text-xs text-text-secondary">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold flex-shrink-0 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                    <HiGift />
                    <span>+{reward.toFixed(3)}</span>
                </div>
            </div>
            
            {isInviteTask && status !== 'CLAIMED' && (
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-text-secondary">{t('tasks.progress', 'Progreso')}</span>
                        <span className="text-text-primary">{progress} / {target}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 border border-border overflow-hidden">
                        <div className="bg-accent h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                </div>
            )}
            
            <div className="flex justify-end items-center pt-3 border-t border-border/50">
                {renderButton()}
            </div>
        </motion.div>
    );
};

export default TaskItem;

// --- END OF FILE TaskItem.jsx ---