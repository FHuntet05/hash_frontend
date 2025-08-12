// RUTA: frontend/src/store/adminStore.js (CON TELEGRAM ID)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axiosConfig';

const useAdminStore = create(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login/admin', { username, password });
          
          if (!data.passwordResetRequired) {
              set({
                admin: data.admin, // MODIFICADO: El objeto 'admin' del backend ya contiene el telegramId
                token: data.token,
                isAuthenticated: true,
              });
          } else {
              set({ token: data.token });
          }
          
          set({ isLoading: false });
          return { success: true, passwordResetRequired: data.passwordResetRequired || false };

        } catch (error) {
          const message = error.response?.data?.message || 'Error al iniciar sesión.';
          set({ isLoading: false, token: null, admin: null, isAuthenticated: false });
          return { success: false, message };
        }
      },

      setAdminAndToken: (token, adminData) => {
        set({
            admin: adminData, // El objeto 'adminData' del backend ya contiene el telegramId
            token: token,
            isAuthenticated: true,
            isLoading: false,
        });
      },

      logout: () => {
        set({ admin: null, token: null, isAuthenticated: false });
      },
      
      setHydrated: () => {
        set({ isHydrated: true });
      },

      // Funciones de 2FA. Se aseguran de que 'admin' también incluya el telegramId.
      completeTwoFactorLogin: async (userId, token) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/2fa/verify-login', { userId, token });
          get().setAdminAndToken(data.token, data.admin); // Asumiendo que el backend envía el objeto 'admin' completo
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Error al verificar el token.';
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      setTwoFactorEnabled: (status) => {
        set((state) => ({ admin: state.admin ? { ...state.admin, isTwoFactorEnabled: status } : null }));
      },

    }),
    {
      name: 'mega-fabrica-admin-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token, 
        admin: state.admin, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      }
    }
  )
);

export default useAdminStore;