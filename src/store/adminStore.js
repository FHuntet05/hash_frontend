// RUTA: frontend/src/store/adminStore.js (FINAL CON MANEJO DE RESETEO)
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
      isHydrated: false, // Flag para saber si Zustand ha cargado los datos del localStorage

      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login/admin', { username, password });
          
          // Si el login es exitoso pero se requiere cambio de contraseña
          if (data.passwordResetRequired) {
            // Guardamos el token temporalmente para autorizar la siguiente petición de cambio de contraseña.
            // NO marcamos como autenticado para forzar el flujo de reseteo.
            set({ token: data.token, isLoading: false });
            return { success: true, passwordResetRequired: true };
          }

          // Si el login es normal y exitoso
          set({
            admin: data.admin,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, passwordResetRequired: false };

        } catch (error) {
          const message = error.response?.data?.message || 'Error al iniciar sesión.';
          set({ isLoading: false, token: null, admin: null, isAuthenticated: false });
          return { success: false, message };
        }
      },

      // Función centralizada para actualizar el estado del admin tras un login exitoso
      // (sea normal, con 2FA, o tras un reseteo de contraseña).
      setAdminAndToken: (token, adminData) => {
        set({
            admin: adminData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
        });
      },

      // Función para desloguear al administrador
      logout: () => {
        set({ admin: null, token: null, isAuthenticated: false });
      },
      
      // Función para marcar que la rehidratación desde el localStorage ha terminado
      setHydrated: () => {
        set({ isHydrated: true });
      },

      // Mantengo estas funciones por si las necesita para el 2FA, pero la lógica necesita ser actualizada
      // para usar setAdminAndToken
      completeTwoFactorLogin: async (userId, token) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/2fa/verify-login', { userId, token });
          // Llamamos a la función centralizada
          get().setAdminAndToken(data.token, { username: data.username, role: data.role, isTwoFactorEnabled: data.isTwoFactorEnabled });
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
      name: 'mega-fabrica-admin-storage', // Nombre actualizado para evitar colisiones
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos los datos esenciales de la sesión.
      partialize: (state) => ({ 
        token: state.token, 
        admin: state.admin, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Cuando Zustand termina de leer del localStorage, llamamos a setHydrated.
        // Esto es crucial para que AdminProtectedRoute sepa cuándo puede tomar una decisión.
        if (state) {
          state.setHydrated();
        }
      }
    }
  )
);

export default useAdminStore;