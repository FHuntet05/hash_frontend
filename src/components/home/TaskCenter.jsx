// RUTA: frontend/src/components/home/TaskCenter.jsx (v2.0 - Dinámico con Backend)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskLogic as useTasks } from '../../hooks/useTaskLogic'; 
import TaskItem from '../tasks/TaskItem';
import { motion } from 'framer-motion';

const TaskCenter = () => {
  const { t } = useTranslation();
  const { tasks, isLoading, handleClaimTask, handleGoToTask } = useTasks();

  if (isLoading) {
      return (
        <div className="w-full space-y-3">
          {/* Skeleton loaders para una mejor UX */}
          <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
          <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
        </div>
      );
  }

  if (!tasks || tasks.length === 0) {
      return (
          <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 text-center text-text-secondary border border-white/20">
              <p>{t('tasks.noTasks', 'No hay tareas disponibles en este momento.')}</p>
          </div>
      );
  }
  
  return (
    <motion.div 
      className="space-y-3" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {tasks.map(task => (
        <TaskItem
            key={task.taskId}
            task={task} // Pasamos el objeto de tarea completo desde el backend
            onGoToTask={handleGoToTask}
            onClaim={handleClaimTask}
        />
      ))}
    </motion.div>
  );
};

export default TaskCenter;