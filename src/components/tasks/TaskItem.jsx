// RUTA: frontend/src/components/tasks/TaskItem.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiCheckCircle, HiGift, HiUsers, HiWrenchScrewdriver, HiArrowTopRightOnSquare } from 'react-icons/hi2';

// Mapeo de iconos actualizado a Heroicons v2 para consistencia
const ICONS = {
    joinedTelegram: <HiUsers />,
    invitedTenFriends: <HiUsers />,
    boughtUpgrade: <HiWrenchScrewdriver />,
};

const TaskItem = ({ task, status, onGoToTask, onClaim }) => {
    const { t } = useTranslation();
    const { id, title, description, reward } = task;
    const isClaimed = status?.claimedTasks?.[id] || false;
    
    const getCompletionStatus = () => {
        if (isClaimed) return 'claimed';
        switch (id) {
            case 'boughtUpgrade': return status?.hasBoughtUpgrade ? 'claimable' : 'pending';
            case 'invitedTenFriends': return (status?.referralCount || 0) >= 3 ? 'claimable' : 'pending';
            case 'joinedTelegram': return status?.telegramVisited ? 'claimable' : 'visitable';
            default: return 'pending';
        }
    };

    const completionStatus = getCompletionStatus();

    const renderButton = () => {
        switch (completionStatus) {
            case 'claimed':
                return (
                    <div className="bg-status-success/10 text-status-success text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <HiCheckCircle /> {t('tasks.claimed', 'Reclamado')}
                    </div>
                );
            case 'claimable':
                return (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onClaim(id)}
                        className="bg-accent-secondary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-accent-secondary-hover"
                    >
                        {t('tasks.claim', 'Reclamar')}
                    </motion.button>
                );
            case 'visitable':
                return (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onGoToTask(task)}
                        className="bg-accent-primary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-accent-primary-hover"
                    >
                        {t('tasks.go', 'Ir')}
                    </motion.button>
                );
            case 'pending':
            default:
                const progressText = id === 'invitedTenFriends' ? `(${(status?.referralCount || 0)}/3)` : '';
                return (
                    <button disabled className="bg-black/10 text-text-secondary text-sm font-semibold px-4 py-1.5 rounded-lg cursor-not-allowed">
                        {t('tasks.pending', 'Pendiente')} {progressText}
                    </button>
                );
        }
    };

    return (
        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-subtle flex flex-col space-y-2">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-background/50 p-2 rounded-full text-accent-primary">
                    {ICONS[id] || <HiGift />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary pr-4">{title}</h3>
                    <p className="text-xs text-text-secondary">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-status-warning font-bold flex-shrink-0">
                    <HiGift />
                    <span>{reward.toLocaleString()}</span>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-border/50">
                {renderButton()}
            </div>
        </div>
    );
};

export default TaskItem;