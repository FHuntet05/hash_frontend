// RUTA: frontend/src/components/home/TaskCenter.jsx (DISEÑO CRISTALINO)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTaskLogic } from '../../hooks/useTaskLogic';
import TaskItem from '../tasks/TaskItem';

const TaskCenter = () => {
  const { t } = useTranslation();
  const { taskStatus, isLoading, handleClaimTask, handleGoToTask } = useTaskLogic();

  // La lista de tareas se puede mover a un archivo de configuración en el futuro si crece.
  const allTasks = [
    { id: 'boughtUpgrade', title: t('tasks.upgrade.title', 'Primera Mejora'), description: t('tasks.upgrade.desc', 'Compra cualquier fábrica.'), reward: 1500 },
    { id: 'invitedTenFriends', title: t('tasks.invite.title', 'Invitar 3 Amigos'), description: t('tasks.invite.desc', 'Tu equipo debe tener 3 miembros.'), reward: 1000 },
    { id: 'joinedTelegram', title: t('tasks.telegram.title', 'Unirse al Grupo'), description: t('tasks.telegram.desc', 'Únete a nuestra comunidad oficial.'), reward: 500, link: 'https://t.me/nicebotntx' },
  ];

  if (!taskStatus && !isLoading) {
      return null;
  }
  
  const LoadingSkeleton = () => (
    <div className="w-full space-y-3">
      <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
      <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
    </div>
  );

  return (
    // La sección 'Tareas' ya está definida en HomePage, por lo que este componente es solo la lista.
    <div>
        {isLoading ? (
            <LoadingSkeleton />
        ) : (
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
        )}
    </div>
  );
};

export default TaskCenter;