// RUTA: frontend/src/store/userStore.js (v3.0 - CON GESTIÓN DE MANTENIMIENTO)

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
      
      // --- NUEVOS ESTADOS ---
      isMaintenanceMode: false,
      maintenanceMessage: '',
      // --- FIN DE NUEVOS ESTADOS ---

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
              isMaintenanceMode: false, // Aseguramos que se desactive si la sincronización es exitosa
              maintenanceMessage: ''
          });

        } catch (error) {
          console.error('[Store] Error durante la sincronización:', error.response?.data?.message || error.message);
          
          // --- INICIO DE LÓGICA DE MANTENIMIENTO ---
          if (error.response && error.response.status === 503) {
            // Si el servidor está en mantenimiento, lo guardamos en el estado.
            set({
              isLoadingAuth: false,
              isAuthenticated: false, // El usuario no está autenticado
              isMaintenanceMode: true,
              maintenanceMessage: error.response.data.maintenanceMessage || 'El sistema está en mantenimiento.'
            });
          } else {
            // Para cualquier otro error (baneo, token inválido, etc.), deslogueamos.
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
          // --- FIN DE LÓGICA DE MANTENIMIENTO ---
        }
      },

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
          isMaintenanceMode: false, // Limpiar al desloguear
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

// Este código no necesita cambios
useUserStore.subscribe(
  (state) => state.token,
  (token) => {
    if (api.defaults.headers.common) {
        api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
    }
  }
);

export default useUserStore;