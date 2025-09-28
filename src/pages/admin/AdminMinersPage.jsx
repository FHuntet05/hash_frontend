// RUTA: frontend/src/pages/admin/AdminFactoriesPage.jsx (REFACTORIZADO)

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import FactoryFormModal from './components/FactoryFormModal'; // Import renombrado
import { HiPencil, HiTrash, HiOutlineCubeTransparent } from 'react-icons/hi2';

const AdminFactoriesPage = () => {
  const [factories, setFactories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState(null);

  const fetchFactories = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/admin/factories'); // Endpoint corregido
      setFactories(data);
    } catch (e) {
      toast.error('No se pudieron cargar las Chips.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFactories();
  }, [fetchFactories]);

  const handleOpenModal = (factory = null) => {
    setEditingFactory(factory);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setEditingFactory(null);
    setIsModalOpen(false);
  };

  const handleSaveFactory = async (formData, factoryId) => {
    const isEditing = !!factoryId;
    const request = isEditing
      ? api.put(`/admin/factories/${factoryId}`, formData)
      : api.post('/admin/factories', formData);

    try {
      await toast.promise(request, {
        loading: 'Guardando fábrica...',
        success: `Fábrica ${isEditing ? 'actualizada' : 'creada'}.`,
        error: 'Ocurrió un error al guardar la fábrica.',
      });
      fetchFactories();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar.');
    }
  };

  const handleDeleteFactory = async (factoryId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta fábrica? Esta acción es irreversible.")) return;
    try {
      await toast.promise(api.delete(`/admin/factories/${factoryId}`), {
        loading: 'Eliminando fábrica...',
        success: 'Fábrica eliminada.',
        error: 'Ocurrió un error al eliminar.',
      });
      fetchFactories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar.');
    }
  };

  return (
    <>
      <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Gestión de Chips</h1>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 font-bold text-white bg-accent-start rounded-lg hover:bg-accent-end transition-colors">
            Crear Fábrica
          </button>
        </div>
        {isLoading ? <div className="h-64 flex items-center justify-center"><Loader /></div> : factories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factories.map(factory => (
              <div key={factory._id} className="bg-dark-primary p-4 rounded-lg border border-white/10 flex flex-col justify-between shadow-lg">
                <img src={factory.imageUrl || 'https://i.postimg.cc/8PqYj4zR/nicebot.jpg'} alt={factory.name} className="w-full h-32 object-contain rounded-t-lg mb-4 bg-black/20" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{factory.name}</h3>
                  <div className="text-sm text-text-secondary space-y-1 mt-2">
                    <p>Precio: <span className="font-mono text-white">{factory.price} USDT</span></p>
                    <p>Producción: <span className="font-mono text-white">{factory.dailyProduction} USDT/Día</span></p>
                    <p>Duración: <span className="font-mono text-white">{factory.durationDays} días</span></p>
                    <p>Gratuita: <span className={`font-mono ${factory.isFree ? 'text-green-400' : 'text-red-400'}`}>{factory.isFree ? 'Sí' : 'No'}</span></p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button onClick={() => handleOpenModal(factory)} className="flex-1 px-3 py-1.5 text-xs flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors"><HiPencil /> Editar</button>
                  <button onClick={() => handleDeleteFactory(factory._id)} className="flex-1 px-3 py-1.5 text-xs flex items-center justify-center gap-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors"><HiTrash /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <HiOutlineCubeTransparent className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-lg font-medium">No hay Chips creadas</h3>
            <p className="mt-1 text-sm">Empieza por crear tu primera fábrica.</p>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isModalOpen && <FactoryFormModal factory={editingFactory} onClose={handleCloseModal} onSave={handleSaveFactory} />}
      </AnimatePresence>
    </>
  );
};
export default AdminMinersPage;