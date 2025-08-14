// RUTA: frontend/src/components/tasks/TaskCenter.jsx (NUEVO ARCHIVO)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTaskLogic } from '../../hooks/useTaskLogic';
import TaskItem from './TaskItem'; // Asegúrate de que TaskItem.jsx esté en la misma carpeta

const TaskCenter = () => {
  const { t } = useTranslation();
  const { taskStatus, isLoading, handleClaimTask, handleGoToTask } = useTaskLogic();

  // Esta lista ahora se encuentra en el frontend y se puede editar fácilmente.
  const allTasks = [
    { id: 'boughtUpgrade', title: t('tasks.upgrade.title', 'Primera Compra'), description: t('tasks.upgrade.desc', 'Compra cualquier fábrica en la tienda.'), reward: 1.5 },
    { id: 'invitedTenFriends', title: t('tasks.invite.title', 'Invitar 3 Amigos'), description: t('tasks.invite.desc', 'Tu equipo debe tener al menos 3 miembros.'), reward: 1.0 },
    { id: 'joinedTelegram', title: t('tasks.telegram.title', 'Unirse al Grupo'), description: t('tasks.telegram.desc', 'Visita nuestra comunidad oficial de Telegram.'), reward: 0.5, link: 'https://t.me/MegaFabricaOficial' },
  ];

  if (isLoading) {
      return (
        <div className="w-full space-y-3">
          <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
          <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
        </div>
      );
  }
  
  return (
    <motion.div 
      className="space-y-3" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
        {allTasks.map(task => (
        <TaskItem
            key={task.id}
            task={task}
            status={taskStatus}
            onGoToTask={handleGoToTask}
            onClaim={handleClaimTask}
        />
        ))}
    </motion.div>
  );
};

export default TaskCenter;