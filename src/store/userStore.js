// RUTA: frontend/src/store/userStore.js (v3.1 - CON ACTUALIZACIÓN DE DATOS)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axiosConfig';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null, 
      token: null, 
      settings: null,
      isAuthenticated: false, 
      isLoadingAuth: true,
      isMaintenanceMode: false,
      maintenanceMessage: '',
      isHydrated: false,

      syncUserWithBackend: async (telegramUser) => {
        if (!get().isLoadingAuth) {
            set({ isLoadingAuth: true });
        }
        try {
          const response = await api.post('/auth/sync', { telegramUser });
          const { token, user, settings } = response.data;
          
          set({ 
              user, 
              token, 
              isAuthenticated: true, 
              settings, 
              isLoadingAuth: false,
              isMaintenanceMode: false,
              maintenanceMessage: ''
          });

        } catch (error) {
          console.error('[Store] Error durante la sincronización:', error.response?.data?.message || error.message);
          
          if (error.response && error.response.status === 503) {
            set({
              isLoadingAuth: false,
              isAuthenticated: false,
              isMaintenanceMode: true,
              maintenanceMessage: error.response.data.maintenanceMessage || 'El sistema está en mantenimiento.'
            });
          } else {
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false, 
              isLoadingAuth: false,
              settings: null,
              isMaintenanceMode: false,
              maintenanceMessage: ''
            });
          }
        }
      },

      // --- INICIO DE NUEVA ACCIÓN ---
      /**
       * Actualiza silenciosamente los datos del usuario (especialmente el saldo)
       * desde el backend sin afectar el estado de autenticación.
       * Esto es útil para actualizaciones en segundo plano (polling).
       */
      refreshUserData: async () => {
        if (!get().isAuthenticated) return; // No hacer nada si no está autenticado

        try {
          // Usamos un endpoint que solo devuelve los datos del usuario actual.
          // '/auth/profile' es un buen candidato.
          const response = await api.get('/auth/profile'); 
          const { user: updatedUser, settings: updatedSettings } = response.data;
          
          set({ user: updatedUser, settings: updatedSettings });
          console.log('[Store] Datos de usuario refrescados en segundo plano.');
        } catch (error) {
          // No hacemos logout en caso de un error de refresco para no interrumpir al usuario.
          // Podría ser un problema de red temporal.
          console.error('[Store] Fallo al refrescar los datos del usuario:', error.response?.data?.message || error.message);
        }
      },
      // --- FIN DE NUEVA ACCIÓN ---

      setUser: (newUserObject) => {
        set({ user: newUserObject });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoadingAuth: false,
          settings: null,
          isMaintenanceMode: false,
          maintenanceMessage: ''
        });
        console.log('[Store] Sesión cerrada.');
      },
      
      _setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'mega-fabrica-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._setHydrated();
        }
      }
    }
  )
);

useUserStore.subscribe(
  (state) => state.token,
  (token) => {
    if (api.defaults.headers.common) {
        api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
    }
  }
);

export default useUserStore;