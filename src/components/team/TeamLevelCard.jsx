// RUTA: frontend/src/components/team/TeamLevelCard.jsx (RECONSTRUIDO PARA MOSTRAR COMISIÓN)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiUserGroup, HiCheckCircle } from 'react-icons/hi2';

// NOTA DE ARQUITECTURA: El componente ahora espera 'totalCommission' en lugar de 'commissionRate'.
const TeamLevelCard = ({ level, members, validMembers, totalCommission }) => {
    const { t } = useTranslation();

    // Formateamos la comisión para asegurar que siempre tenga dos decimales.
    const formattedCommission = (totalCommission || 0).toFixed(2);

    return (
        // Contenedor principal: ancho completo, usando colores semánticos.
        <div className="w-full bg-card rounded-lg p-4 border border-border shadow-lg">
            
            {/* Cabecera: Nivel y total de miembros */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-text-primary">
                    {t('teamPage.levelLabel', 'Nivel {{level}}', { level })}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <HiUserGroup className="w-5 h-5" />
                    <span>{t('teamPage.members', '{{count}} Miembros', { count: members })}</span>
                </div>
            </div>

            {/* Cuerpo: La cifra más importante, la comisión obtenida */}
            <div className="mt-3 text-center border-t border-border pt-3">
                <p className="text-sm text-text-secondary uppercase tracking-wider">
                    {t('teamPage.commissionEarned', 'Comisión Obtenida')}
                </p>
                <p className="text-4xl font-bold text-accent-secondary mt-1">
                    {formattedCommission} <span className="text-2xl">USDT</span>
                </p>
            </div>

            {/* Pie: Detalle de miembros válidos */}
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