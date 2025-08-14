// frontend/src/store/userStore.js (v2.1 - CON LOGS DE DEPURACIÓN)

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
      isHydrated: false,

      syncUserWithBackend: async (telegramUser) => {
        if (!get().isLoadingAuth) {
            set({ isLoadingAuth: true });
        }
        try {
          console.log('[Store] Sincronizando usuario con el backend...');
          const response = await api.post('/auth/sync', { telegramUser });
          const { token, user, settings } = response.data;

          // --- INICIO DE LOG DE DEPURACIÓN ---
          console.log('[Store - DEBUG] Usuario recibido del backend. Verificando fábricas:', user.purchasedFactories);
          // --- FIN DE LOG DE DEPURACIÓN ---
          
          set({ 
              user, 
              token, 
              isAuthenticated: true, 
              settings, 
              isLoadingAuth: false 
          });
          console.log('[Store] Sincronización exitosa.');

        } catch (error) {
          console.error('[Store] Error fatal durante la sincronización:', error.response?.data?.message || error.message);
          set({ 
              user: null, 
              token: null, 
              isAuthenticated: false, 
              isLoadingAuth: false,
              settings: null,
          });
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