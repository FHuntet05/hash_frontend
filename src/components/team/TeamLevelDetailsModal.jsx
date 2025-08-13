// RUTA: frontend/src/components/team/TeamLevelDetailsModal.jsx (DISEÑO CRISTALINO Y LÓGICA LIMPIA)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiXMark, HiUserCircle } from 'react-icons/hi2';
import Loader from '../common/Loader';

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
  exit: { y: "100%", transition: { duration: 0.3 } },
};

// Subcomponente UserRow rediseñado
const UserRow = ({ user }) => (
  <div className="flex items-center gap-3 p-3 bg-background/50 backdrop-blur-sm rounded-2xl border border-white/10">
    {user.photoUrl ? (
      <img src={user.photoUrl} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
    ) : (
      <HiUserCircle className="w-10 h-10 text-text-tertiary" />
    )}
    <span className="font-semibold text-text-primary truncate">{user.username}</span>
    {/* NOTA DE ARQUITECTURA: La sección de "Aporte" y NTX/H ha sido eliminada por ser obsoleta. */}
  </div>
);

const TeamLevelDetailsModal = ({ level, users, isLoading, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-card/80 backdrop-blur-lg w-full h-[75vh] max-w-lg rounded-t-2xl border-t border-white/20 shadow-medium flex flex-col"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">
            {t('teamDetailsModal.title', 'Detalles del Nivel {{level}}', { level })}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-text-tertiary hover:text-text-primary hover:bg-black/10 transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow p-4 overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader text={t('teamDetailsModal.loading', 'Cargando miembros...')} />
            </div>
          ) : users && users.length > 0 ? (
            <div className="space-y-2">
              {/* Usamos user._id si está disponible, de lo contrario username como fallback. */}
              {users.map((user, index) => (
                <UserRow key={user._id || user.username || index} user={user} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-text-secondary">
              <p>{t('teamDetailsModal.empty', 'No hay miembros en este nivel todavía.')}</p>
            </div>
          )}
        </main>
      </motion.div>
    </motion.div>
  );
};

export default TeamLevelDetailsModal;