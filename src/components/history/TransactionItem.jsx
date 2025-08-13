// RUTA: frontend/src/components/history/TransactionItem.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiArrowDownOnSquare, HiArrowUpOnSquare, HiMiniCpuChip, HiShoppingBag, 
  HiArrowsRightLeft, HiUsers, HiTrophy 
} from 'react-icons/hi2';

// Paleta de detalles de transacción actualizada con clases semánticas de Tailwind
const transactionDetails = {
  deposit: { icon: HiArrowDownOnSquare, color: 'text-status-success', bgColor: 'bg-status-success/10' },
  withdrawal: { icon: HiArrowUpOnSquare, color: 'text-status-danger', bgColor: 'bg-status-danger/10' },
  purchase: { icon: HiShoppingBag, color: 'text-accent-tertiary', bgColor: 'bg-accent-tertiary/10' }, // Naranja
  swap_ntx_to_usdt: { icon: HiArrowsRightLeft, color: 'text-accent-primary', bgColor: 'bg-accent-primary/10' }, // Azul
  mining_claim: { icon: HiMiniCpuChip, color: 'text-accent-secondary', bgColor: 'bg-accent-secondary/10' }, // Verde
  referral_commission: { icon: HiUsers, color: 'text-pink-500', bgColor: 'bg-pink-500/10' }, // Un color especial
  task_reward: { icon: HiTrophy, color: 'text-status-warning', bgColor: 'bg-status-warning/10' }, // Amarillo/Dorado
  default: { icon: HiShoppingBag, color: 'text-text-secondary', bgColor: 'bg-slate-500/10' },
};

const TransactionItem = ({ transaction }) => {
  const details = transactionDetails[transaction.type] || transactionDetails.default;
  const Icon = details.icon;
  
  const isPositive = ['deposit', 'mining_claim', 'referral_commission', 'task_reward'].includes(transaction.type);
  const amountSign = isPositive ? '+' : '-';
  // Colores del monto basados en las clases de estado
  const amountColor = isPositive ? 'text-status-success' : 'text-status-danger';

  return (
    <motion.div 
      // Estilo de tarjeta de cristal para tema claro
      className="flex items-center justify-between p-3 bg-card/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-subtle"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
    >
      <div className="flex items-center gap-4">
        {/* Fondo del icono ahora es un tinte del color del icono */}
        <div className={`p-2 rounded-full ${details.bgColor} ${details.color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          {/* Colores de texto adaptados al tema claro */}
          <p className="font-semibold text-text-primary">{transaction.description}</p>
          <p className="text-xs text-text-secondary">
            {new Date(transaction.createdAt).toLocaleString('es-ES', { 
              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-lg ${amountColor}`}>
          {amountSign} {parseFloat(transaction.amount).toFixed(2)}
        </p>
        <p className="text-xs text-text-secondary">{transaction.currency}</p>
      </div>
    </motion.div>
  );
};

export default TransactionItem;