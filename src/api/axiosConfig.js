// frontend/src/api/axiosConfig.js (VERSIÓN INTELIGENTE Y UNIFICADA)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
console.log(`[Axios Config] API Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor de Petición (Request)
// Se ejecuta ANTES de que cada petición sea enviada.
api.interceptors.request.use(
  async (config) => {
    // Importamos dinámicamente ambos stores para obtener el estado más reciente.
    // Esto evita dependencias circulares y asegura que usamos la fuente de verdad correcta.
    const useAdminStore = (await import('../store/adminStore')).default;
    const useUserStore = (await import('../store/userStore')).default;

    const adminToken = useAdminStore.getState().token;
    const userToken = useUserStore.getState().token;

    // LÓGICA DE PRIORIDAD: Si existe un token de admin, se usa ese.
    // Si no, se busca un token de usuario. Esto asegura que las sesiones
    // del panel de admin siempre tengan prioridad.
    const token = adminToken || userToken;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Si hay un error al configurar la petición, lo rechazamos.
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (Response)
// Se ejecuta DESPUÉS de recibir una respuesta del servidor.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el servidor nos devuelve un 401 (No Autorizado), significa que nuestro
    // token es inválido o ha expirado. Limpiamos la sesión local para forzar un nuevo login.
    if (error.response && error.response.status === 401) {
      console.warn('[Axios Interceptor] Error 401. Deslogueando sesión activa.');
      
      const useAdminStore = (await import('../store/adminStore')).default;
      const useUserStore = (await import('../store/userStore')).default;

      // Desloguea la sesión que esté activa.
      if (useAdminStore.getState().isAuthenticated) {
        useAdminStore.getState().logout();
      }
      if (useUserStore.getState().isAuthenticated) {
        useUserStore.getState().logout();
      }
      
      // Opcional: Redirigir a la página de login si es un error de admin
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;