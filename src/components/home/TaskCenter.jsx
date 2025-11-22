import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskLogic } from '../../hooks/useTaskLogic'; 
import TaskItem from '../tasks/TaskItem';
import { motion } from 'framer-motion';
import Loader from '../common/Loader';

const TaskCenter = () => {
  const { t } = useTranslation();
  const { tasks, isLoading, handleClaimTask, handleGoToTask } = useTaskLogic();

  if (isLoading) return <div className="flex justify-center py-10"><Loader /></div>;

  if (!tasks || tasks.length === 0) {
      return (
          <div className="bg-surface/50 backdrop-blur-md rounded-2xl p-8 text-center text-text-secondary border border-border border-dashed">
              <p>{t('tasks.noTasks', 'No hay misiones disponibles por ahora.')}</p>
          </div>
      );
  }
  
  return (
    <motion.div 
      className="space-y-3 pb-4" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {tasks.map(task => {
        const translatedTask = {
          ...task,
          title: t(`tasks.${task.taskId}.title`), 
          description: t(`tasks.${task.taskId}.description`, { count: task.target }),
        };
        
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