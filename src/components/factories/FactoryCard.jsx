// RUTA: frontend/src/components/factories/FactoryCard.jsx (NUEVO, ANTES ToolCard.jsx)
import React from 'react';

const FactoryCard = ({ factory, onBuyClick, ownedCount = 0 }) => {
  // En la nueva lógica, una fábrica no se puede comprar más de una vez si no es apilable.
  // Por ahora, asumimos que no hay bloqueos y el botón siempre se muestra si no se posee.
  // La lógica de 'isLocked' se simplifica o elimina dependiendo de las reglas de negocio futuras.
  const isLocked = ownedCount > 0; // Ejemplo simple: si ya tienes 1, se bloquea.

  return (
    <div className={`
      bg-dark-secondary/70 backdrop-blur-lg rounded-2xl p-5 border flex flex-col gap-4 text-white
      ${isLocked ? 'border-gray-600/50' : 'border-white/10'}
    `}>
      {/* Cabecera de la tarjeta */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold">{factory.name}</h3> 
        </div>
        <img 
          src={factory.imageUrl || '/assets/images/tool-placeholder.png'} 
          alt={factory.name} 
          className={`w-16 h-16 object-contain flex-shrink-0 ${isLocked ? 'opacity-50' : ''}`}
        />
      </div>

      {/* Detalles de la fábrica */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Producción Diaria</span> 
          {/* MODIFICADO: Muestra la producción diaria en USDT */}
          <span className="font-semibold">{factory.dailyProduction || 0} USDT</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Vida Útil</span>
          <span className="font-semibold">{factory.durationDays || 0} Días</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Precio</span>
          <span className="font-bold text-xl text-green-400">{factory.price || 0} USDT</span>
        </div>
      </div>
      
      {ownedCount > 0 && (
        <div className="text-center text-xs text-accent-start bg-accent-start/10 py-1 rounded-md">
          Posees: {ownedCount}
        </div>
      )}

      {/* Botón de compra condicional */}
      <button 
        onClick={() => onBuyClick(factory)}
        disabled={isLocked}
        className={`
          w-full mt-2 py-3 text-white font-bold rounded-full transition-all duration-150
          ${isLocked 
            ? 'bg-gray-700 cursor-not-allowed opacity-60' 
            : 'bg-gradient-to-r from-accent-start to-accent-end shadow-glow transform active:scale-95'
          }
        `}
      >
        {isLocked ? 'ADQUIRIDA' : 'COMPRAR AHORA'}
      </button>
    </div>
  );
};

export default FactoryCard;