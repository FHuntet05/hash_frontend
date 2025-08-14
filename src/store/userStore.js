// frontend/src/store/userStore.js (v2.0 - PERSISTENCIA LIMPIA Y ESTADO DE HIDRATACIÓN)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axiosConfig';

const useUserStore = create(
  persist(
    (set, get) => ({
      // --- ESTADOS DEL STORE ---
      user: null, 
      token: null, 
      settings: null,
      isAuthenticated: false, 
      isLoadingAuth: true, // Inicia como true hasta que la sincronización termine
      isHydrated: false, // Nuevo estado para controlar la carga desde localStorage

      /**
       * Sincroniza los datos del usuario de Telegram con el backend.
       * Esta es la función principal que se llama al iniciar la app.
       * @param {object} telegramUser - El objeto `user` de `window.Telegram.WebApp.initDataUnsafe`.
       */
      syncUserWithBackend: async (telegramUser) => {
        // Aseguramos que el estado de carga esté activo durante la sincronización
        if (!get().isLoadingAuth) {
            set({ isLoadingAuth: true });
        }

        try {
          console.log('[Store] Sincronizando usuario con el backend...');
          const response = await api.post('/auth/sync', { telegramUser });
          
          const { token, user, settings } = response.data;
          
          set({ 
              user, 
              token, 
              isAuthenticated: true, 
              settings, 
              isLoadingAuth: false 
          });
          console.log('[Store] Sincronización exitosa. Usuario autenticado.');

        } catch (error) {
          console.error('[Store] Error fatal durante la sincronización:', error.response?.data?.message || error.message);
          // Si falla, reseteamos todo y marcamos que ya no está cargando.
          set({ 
              user: null, 
              token: null, 
              isAuthenticated: false, 
              isLoadingAuth: false,
              settings: null,
          });
        }
      },

      /**
       * Actualiza completamente el objeto de usuario en el store.
       * Útil después de operaciones como comprar o reclamar una fábrica.
       * @param {object} newUserObject - El nuevo objeto de usuario completo.
       */
      setUser: (newUserObject) => {
        set({ user: newUserObject });
      },
      
      /**
       * Cierra la sesión del usuario, limpiando todos los datos relevantes.
       */
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
      
      /**
       * Función interna llamada por el middleware `persist` para indicar que la carga
       * desde localStorage ha finalizado.
       */
      _setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'mega-fabrica-auth-storage', // Nombre claro para el almacenamiento
      storage: createJSONStorage(() => localStorage),
      
      // --- INICIO DE MODIFICACIÓN CLAVE ---
      // Solo persistimos el token. El resto de datos debe ser fresco del backend.
      partialize: (state) => ({ 
        token: state.token 
      }),
      // --- FIN DE MODIFICACIÓN CLAVE ---

      // Cuando la rehidratación termina, llamamos a nuestra función para actualizar el estado.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._setHydrated();
        }
      }
    }
  )
);

// Añadimos un listener para actualizar el token en Axios cada vez que cambie
useUserStore.subscribe(
  (state) => state.token,
  (token) => {
    if (api.defaults.headers.common) {
        api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
    }
  }
);


export default useUserStore;