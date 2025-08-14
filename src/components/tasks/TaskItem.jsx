// RUTA: frontend/src/components/tasks/TaskItem.jsx (v2.0 - Backend-Driven)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiCheckCircle, HiGift, HiUsers, HiWrenchScrewdriver, HiArrowTopRightOnSquare, HiPaperAirplane } from 'react-icons/hi2';

const ICONS = {
    FIRST_PURCHASE: <HiWrenchScrewdriver />,
    INVITE_3: <HiUsers />,
    INVITE_5: <HiUsers />,
    INVITE_10: <HiUsers />,
    INVITE_20: <HiUsers />,
    TELEGRAM_VISIT: <HiPaperAirplane />,
};

const TaskItem = ({ task, onGoToTask, onClaim }) => {
    const { t } = useTranslation();
    const { taskId, title, description, reward, status, progress, target } = task;

    const renderButton = () => {
        switch (status) {
            case 'CLAIMED':
                return (
                    <div className="bg-status-success/10 text-status-success text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <HiCheckCircle /> {t('tasks.claimed', 'Reclamado')}
                    </div>
                );
            case 'COMPLETED_NOT_CLAIMED':
                // Para Telegram, el botón "Ir" se encarga de todo. Para otros, es "Reclamar".
                if (taskId === 'TELEGRAM_VISIT') {
                     return (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onGoToTask(task)}
                            className="bg-accent-primary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-accent-primary-hover flex items-center gap-2"
                        >
                            {t('tasks.go', 'Ir')} <HiArrowTopRightOnSquare/>
                        </motion.button>
                    );
                }
                return (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onClaim(taskId)}
                        className="bg-accent-secondary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-accent-secondary-hover animate-pulse"
                    >
                        {t('tasks.claim', 'Reclamar')}
                    </motion.button>
                );
            case 'PENDING':
            default:
                const progressText = (typeof progress === 'number' && typeof target === 'number') 
                    ? `(${progress}/${target})` 
                    : '';
                return (
                    <button disabled className="bg-black/10 text-text-secondary text-sm font-semibold px-4 py-1.5 rounded-lg cursor-not-allowed">
                        {t('tasks.pending', 'Pendiente')} {progressText}
                    </button>
                );
        }
    };

    return (
        <motion.div 
            className="bg-card/70 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-subtle flex flex-col space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-background/50 p-2.5 rounded-full text-accent-primary text-lg">
                    {ICONS[taskId] || <HiGift />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary pr-4">{title}</h3>
                    <p className="text-xs text-text-secondary">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold flex-shrink-0">
                    <HiGift />
                    <span>+{reward.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-border/50">
                {renderButton()}
            </div>
        </motion.div>
    );
};

export default TaskItem;