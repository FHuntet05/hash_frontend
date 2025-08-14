// RUTA: frontend/src/hooks/useTasks.js (NUEVO ARCHIVO)

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Función para obtener el estado de las tareas desde el backend
const fetchTasksStatus = async () => {
    const { data } = await api.get('/tasks/status');
    return data;
};

// Función para enviar una solicitud de reclamo al backend
const claimTaskRequest = async (taskId) => {
    const { data } = await api.post('/tasks/claim', { taskId });
    return data;
};

export const useTasks = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Usamos react-query para gestionar el fetching, cacheo y estado de carga/error
    const { data: tasks = [], isLoading, error } = useQuery('tasksStatus', fetchTasksStatus, {
        staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
    });

    // Usamos useMutation para manejar la operación de reclamo
    const { mutate: claimTask, isLoading: isClaiming } = useMutation(claimTaskRequest, {
        onSuccess: (data) => {
            toast.success(data.message || t('tasks.toasts.claimSuccess'));
            // Invalidamos la query 'tasksStatus' para que se vuelva a obtener la lista actualizada
            queryClient.invalidateQueries('tasksStatus');
            // También invalidamos los datos del usuario por si la recompensa actualiza el saldo
            queryClient.invalidateQueries('userData'); 
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || t('common.error'));
        },
    });

    // Manejador para el botón "Ir"
    const handleGoToTask = useCallback((task) => {
        if (task.taskId === 'TELEGRAM_VISIT' && task.actionUrl) {
            // Abre el enlace en una nueva pestaña
            window.open(task.actionUrl, '_blank');
            // Inmediatamente después del clic, reclamamos la tarea
            // Asumimos que el backend marcará la tarea como completada al recibir este reclamo.
            claimTask(task.taskId);
        } else if (task.actionUrl) {
            // Para otras tareas como "comprar fábrica", navegamos dentro de la app
            navigate(task.actionUrl);
        }
    }, [navigate, claimTask]);

    return {
        tasks,
        isLoading,
        isClaiming,
        error,
        handleClaimTask: claimTask,
        handleGoToTask,
    };
};