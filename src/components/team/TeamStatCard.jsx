// RUTA: frontend/src/components/team/TeamStatCard.jsx (DISEÑO CRISTALINO)

import React from 'react';

const TeamStatCard = ({ title, value, icon: Icon, colorClass = "text-text-primary" }) => {
  return (
    // Tarjeta rediseñada con efecto de cristal
    <div className="bg-card/70 backdrop-blur-md p-4 rounded-2xl flex flex-col items-start justify-between border border-white/20 shadow-subtle">
      <div className="flex items-center gap-2">
        {/* El ícono y el título ahora usan colores de texto semánticos */}
        {Icon && <Icon className="w-5 h-5 text-text-tertiary" />}
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
      </div>
      <p className={`text-2xl font-bold mt-2 ${colorClass}`}>
        {value}
      </p>
    </div>
  );
};

export default TeamStatCard;