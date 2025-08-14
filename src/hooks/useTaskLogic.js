// RUTA: frontend/src/hooks/useTaskLogic.js (CORRECCIÓN DE EXPORTACIÓN)

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useUserStore from '../store/userStore';

const fetchTasksStatus = async () => {
    const { data } = await api.get('/tasks/status');
    return data;
};

const claimTaskRequest = async (taskId) => {
    const { data } = await api.post('/tasks/claim', { taskId });
    return data;
};

// --- INICIO DE LA CORRECCIÓN ---
// Se ha cambiado el nombre de la función de 'useTasks' a 'useTaskLogic'
// para que coincida con lo que se espera al importar.
export const useTaskLogic = () => {
// --- FIN DE LA CORRECIÓN ---
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const setUser = useUserStore(state => state.setUser);

    const { data: tasks = [], isLoading, error } = useQuery('tasksStatus', fetchTasksStatus, {
        staleTime: 5 * 60 * 1000,
    });

    const { mutate: claimTask, isLoading: isClaiming } = useMutation(claimTaskRequest, {
        onSuccess: (data) => {
            toast.success(data.message || t('tasks.toasts.claimSuccess'));
            queryClient.invalidateQueries('tasksStatus');
            queryClient.invalidateQueries('userData');
            
            if (data.user) {
                setUser(data.user);
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || t('common.error'));
        },
    });

    const handleGoToTask = (task) => {
        if (task.taskId === 'TELEGRAM_VISIT' && task.actionUrl) {
            window.open(task.actionUrl, '_blank');
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