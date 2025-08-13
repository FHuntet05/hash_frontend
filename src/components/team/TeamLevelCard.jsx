// RUTA: frontend/src/components/team/TeamLevelCard.jsx (REDISEÑO COMPLETO)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUserGroup, HiCheckCircle, HiChevronRight } from 'react-icons/hi2';

const TeamLevelCard = ({ level, members, validMembers, commissionRate }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/team/level/${level}`);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between border border-slate-700 shadow-lg">
      {/* Lado Izquierdo: Información del Nivel */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-slate-50">Nivel {level}</h3>
        <p className="text-xs text-lime-400 mt-1">Comisión: {commissionRate}%</p>
        
        <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <HiUserGroup className="w-4 h-4 text-slate-500" />
            <span>{members} Miembros</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiCheckCircle className="w-4 h-4 text-green-500" />
            <span>{validMembers} Válidos</span>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Botón de Acción */}
      <div className="flex-shrink-0">
        <button
          onClick={handleViewDetails}
          className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 transition-colors"
        >
          <HiChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </div>
  );
};

export default TeamLevelCard;