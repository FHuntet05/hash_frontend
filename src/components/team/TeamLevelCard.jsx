// RUTA: frontend/src/components/team/TeamLevelCard.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiUserGroup, HiCheckCircle } from 'react-icons/hi2';

const TeamLevelCard = ({ level, members, validMembers, totalCommission }) => {
    const { t } = useTranslation();
    const formattedCommission = (totalCommission || 0).toFixed(2);

    return (
        <div className="w-full bg-card/70 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-subtle">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-text-primary">
                    {t('teamPage.levelLabel', 'Nivel {{level}}', { level })}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <HiUserGroup className="w-5 h-5" />
                    <span>{t('teamPage.members', '{{count}} Miembros', { count: members })}</span>
                </div>
            </div>
            <div className="mt-3 text-center border-t border-border pt-3">
                <p className="text-sm text-text-secondary uppercase tracking-wider">
                    {t('teamPage.commissionEarned', 'Comisión Obtenida')}
                </p>
                <p className="text-4xl font-bold text-accent-secondary mt-1">
                    {formattedCommission} <span className="text-2xl">USDT</span>
                </p>
            </div>
            <div className="mt-3 text-center">
                <p className="text-xs text-text-tertiary flex items-center justify-center gap-1.5">
                    <HiCheckCircle className="w-4 h-4 text-status-success" />
                    <span>{t('teamPage.validMembers', '{{count}} miembros válidos', { count: validMembers })}</span>
                </p>
            </div>
        </div>
    );
};

export default TeamLevelCard;