// RUTA: frontend/src/components/team/TeamStatCard.jsx (UI RENOVADA)

import React from 'react';

const TeamStatCard = ({ title, value, icon: Icon, colorClass = "text-sky-400" }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-start justify-between border border-slate-700 shadow-lg">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-slate-500" />}
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      </div>
      <p className={`text-2xl font-bold mt-2 ${colorClass}`}>
        {value}
      </p>
    </div>
  );
};

export default TeamStatCard;