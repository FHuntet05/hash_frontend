// RUTA: frontend/src/components/home/TaskCenter.jsx (v2.1 - INTERNACIONALIZADO)

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
      {tasks.map(task => {
        // --- INICIO DE MODIFICACIÓN CRÍTICA ---
        // Reconstruimos el objeto 'task' con el texto traducido antes de pasarlo al componente hijo.
        const translatedTask = {
          ...task,
          // La clave será, por ejemplo, 'tasks.INVITE_3.title'
          title: t(`tasks.${task.taskId}.title`), 
          // La clave será, por ejemplo, 'tasks.INVITE_3.description'
          // Pasamos el 'target' como variable de interpolación.
          description: t(`tasks.${task.taskId}.description`, { count: task.target }),
        };
        // --- FIN DE MODIFICACIÓN CRÍTICA ---
        
        return (
          <TaskItem
              key={task.taskId}
              task={translatedTask} // Pasamos el objeto de tarea ya traducido
              onGoToTask={handleGoToTask}
              onClaim={handleClaimTask}
          />
        );
      })}
    </motion.div>
  );
};

export default TaskCenter;