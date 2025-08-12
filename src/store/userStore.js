// frontend/src/store/userStore.js (VERSIÓN MEGA FÁBRICA - SINCRONIZADA Y LIMPIA)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axiosConfig'; // La configuración de Axios ya tiene los interceptores inteligentes

const useUserStore = create(
  persist(
    (set, get) => ({
      // --- ESTADOS DEL STORE ---
      user: null, 
      token: null, 
      isAuthenticated: false, 
      isLoadingAuth: true, 
      settings: null,
      isHydrated: false,
      
      /**
       * Sincroniza los datos del usuario de Telegram con el backend.
       * @param {object} telegramUser - El objeto `user` de `window.Telegram.WebApp.initDataUnsafe`.
       */
      syncUserWithBackend: async (telegramUser) => {
        // No seteamos isLoadingAuth a true aquí, lo dejamos en el estado inicial
        try {
          console.log('[Store] Enviando datos de usuario al backend para sincronizar...');
          const response = await api.post('/auth/sync', { telegramUser });
          
          const { token, user, settings } = response.data;
          
          set({ 
              user, 
              token, 
              isAuthenticated: true, 
              settings, 
              isLoadingAuth: false 
            });
          console.log('[Store] Sincronización completada con éxito.');

        } catch (error) {
          console.error('Error fatal al sincronizar usuario:', error);
          set({ 
              user: null, 
              token: null, 
              isAuthenticated: false, 
              isLoadingAuth: false 
            });
        }
      },

      /**
       * Actualiza completamente el objeto de usuario en el store.
       * @param {object} newUserObject - El nuevo objeto de usuario completo.
       */
      setUser: (newUserObject) => {
        set({ user: newUserObject });
      },
      
      /**
       * Limpia el estado de autenticación del usuario.
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoadingAuth: false,
          settings: null,
        })
      },
      
      // Función para marcar que la rehidratación desde el localStorage ha terminado
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'mega-fabrica-user-storage', // Nombre actualizado para evitar colisiones
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos el token. El usuario y los settings se deben obtener frescos del backend.
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      }
    }
  )
);

export default useUserStore;