// RUTA: frontend/src/components/home/TaskCenter.jsx (v2.2 - SINCRONIZADO CON TAREAS 2.0)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskLogic } from '../../hooks/useTaskLogic'; 
import TaskItem from '../tasks/TaskItem';
import { motion } from 'framer-motion';

const TaskCenter = () => {
  const { t } = useTranslation();
  // Se renombra el hook para mayor claridad, pero la funcionalidad interna es la misma.
  const { tasks, isLoading, handleClaimTask, handleGoToTask } = useTaskLogic();

  // El estado de carga no necesita cambios.
  if (isLoading) {
      return (
        <div className="w-full space-y-3">
          <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
          <div className="h-24 bg-card/50 rounded-2xl animate-pulse"></div>
        </div>
      );
  }

  // El estado de "sin tareas" no necesita cambios.
  if (!tasks || tasks.length === 0) {
      return (
          <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 text-center text-text-secondary border border-border">
              <p>{t('tasks.noTasks')}</p>
          </div>
      );
  }
  
  return (
    <motion.div 
      className="space-y-3" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      // La animación de stagger es perfecta para la nueva lista de tareas.
      transition={{ staggerChildren: 0.1 }}
    >
      {tasks.map(task => {
        // --- INICIO DE LA OPTIMIZACIÓN ---
        // La lógica de traducción se mantiene, ya que es correcta y robusta.
        // Se asegura la compatibilidad con interpolación para futuras descripciones.
        const translatedTask = {
          ...task,
          title: t(`tasks.${task.taskId}.title`), 
          description: t(`tasks.${task.taskId}.description`, { 
            // Se pasa el 'target' como variable de interpolación por si se necesita en el futuro.
            count: task.target 
          }),
        };
        // --- FIN DE LA OPTIMIZACIÓN ---
        
        return (
          <TaskItem
              key={task.taskId}
              task={translatedTask}
              onGoToTask={handleGoToTask}
              onClaim={handleClaimTask}
          />
        );
      })}
    </motion.div>
  );
};

export default TaskCenter;