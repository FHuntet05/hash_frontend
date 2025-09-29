// --- START OF FILE TasksPage.jsx ---

// RUTA: frontend/src/pages/TasksPage.jsx (NUEVA PÁGINA)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TaskCenter from '../components/home/TaskCenter'; // Reutilizamos el componente TaskCenter

const TasksPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pt-6 pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">{t('tasksPage.title', 'Centro de Tareas')}</h1>
        <p className="text-text-secondary text-sm">{t('tasksPage.description', 'Completa tareas para ganar recompensas adicionales y acelerar tu progreso.')}</p>
      </div>
      
      {/* El TaskCenter ahora vive aquí, en su propia página dedicada. */}
      <TaskCenter />

    </motion.div>
  );
};

export default TasksPage;

// --- END OF FILE TasksPage.jsx ---