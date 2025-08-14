// RUTA: frontend/src/components/team/TeamLevelCard.jsx (v2.1 - SINCRONIZADO CON API Y DISEÑO LIMPIO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiUserGroup, HiBanknotes } from 'react-icons/hi2';

// --- INICIO DE MODIFICACIÓN: Se aceptan solo las props que la API provee ---
const TeamLevelCard = ({ level, members, totalCommission }) => {
  const { t } = useTranslation();

  const levelColors = {
    1: 'border-accent-gold',
    2: 'border-accent-silver',
    3: 'border-accent-bronze',
  };

  return (
    <motion.div
      className={`bg-card/70 backdrop-blur-md rounded-2xl p-4 border-l-4 ${levelColors[level] || 'border-border'} shadow-subtle`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-text-primary">
            {t('teamPage.levelLabel', 'Nivel {{level}}', { level })}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
        
        {/* Columna de Miembros */}
        <div className="text-center">
            <p className="text-xs text-text-secondary uppercase tracking-wider flex items-center justify-center gap-1">
                <HiUserGroup />
                {t('teamPage.levels.totalMembers', 'Miembros')}
            </p>
            <p className="font-semibold text-text-primary text-2xl mt-1">{members || 0}</p>
        </div>

        {/* Columna de Comisión */}
        <div className="text-center">
             <p className="text-xs text-text-secondary uppercase tracking-wider flex items-center justify-center gap-1">
                <HiBanknotes />
                {t('teamPage.levels.commission', 'Comisión')}
            </p>
            <p className="font-semibold text-accent-secondary text-2xl mt-1">
                {(totalCommission || 0).toFixed(2)}
            </p>
        </div>

      </div>
       {/* Se elimina la sección de "miembros válidos" y el botón de "detalles" */}
    </motion.div>
  );
};

export default TeamLevelCard;