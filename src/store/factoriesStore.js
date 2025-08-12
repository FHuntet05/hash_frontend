// RUTA: frontend/src/store/factoriesStore.js (NUEVO)
import { create } from 'zustand';
import api from '../api/axiosConfig';

const useFactoriesStore = create((set) => ({
  factories: [],
  loading: false,
  error: null,

  fetchFactories: async () => {
    set({ loading: true, error: null });
    try {
      // El endpoint del admin para obtener las fábricas (antes tools) ahora es /factories
      const response = await api.get('/admin/factories'); 
      set({ factories: response.data, loading: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar las fábricas';
      set({ error: errorMessage, loading: false });
    }
  },
}));

export default useFactoriesStore;