// RUTA: frontend/src/hooks/useTasks.js (NUEVO ARCHIVO - CORRECCIÓN DE OMISIÓN)

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';

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
    const setUser = useUserStore(state => state.setUser);

    // Usamos react-query para gestionar el fetching, cacheo y estado de carga/error
    const { data: tasks = [], isLoading, error } = useQuery('tasksStatus', fetchTasksStatus, {
        staleTime: 5 * 60 * 1000,
    });

    // Usamos useMutation para manejar la operación de reclamo
    const { mutate: claimTask, isLoading: isClaiming } = useMutation(claimTaskRequest, {
        onSuccess: (data) => {
            toast.success(data.message || t('tasks.toasts.claimSuccess'));
            // Invalidamos las queries para que se obtengan los datos más frescos
            queryClient.invalidateQueries('tasksStatus');
            queryClient.invalidateQueries('userData'); // invalida el hook useUser que obtiene los datos del usuario
            
            // Opcionalmente, si la respuesta del claim trae el usuario actualizado
            if (data.user) {
                setUser(data.user);
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || t('common.error'));
        },
    });

    // Manejador para el botón "Ir"
    const handleGoToTask = (task) => {
        if (task.taskId === 'TELEGRAM_VISIT' && task.actionUrl) {
            window.open(task.actionUrl, '_blank');
            // La lógica ahora es que el backend marca la visita al reclamar.
            // Para mejorar la UX, podemos intentar el reclamo inmediatamente.
            claimTask(task.taskId);
        } else if (task.actionUrl) {
            navigate(task.actionUrl);
        }
    };

    return {
        tasks,
        isLoading,
        isClaiming,
        error,
        handleClaimTask: claimTask,
        handleGoToTask,
    };
};