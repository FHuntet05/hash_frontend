// RUTA: frontend/src/pages/admin/AdminMinersPage.jsx (v2.1 - TEXTOS ALINEADOS)

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import MinerFormModal from './components/MinerFormModal'; 
import { HiPencil, HiTrash, HiOutlineCubeTransparent } from 'react-icons/hi2';

const AdminMinersPage = () => {
  const [miners, setMiners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMiner, setEditingMiner] = useState(null);

  const fetchMiners = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/admin/miners'); 
      setMiners(data);
    } catch (e) {
      toast.error('No se pudieron cargar los mineros.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMiners();
  }, [fetchMiners]);

  const handleOpenModal = (miner = null) => {
    setEditingMiner(miner);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setEditingMiner(null);
    setIsModalOpen(false);
  };

  const handleSaveMiner = async (formData, minerId) => {
    const isEditing = !!minerId;
    const request = isEditing
      ? api.put(`/admin/miners/${minerId}`, formData)
      : api.post('/admin/miners', formData);

    try {
      await toast.promise(request, {
        loading: 'Guardando minero...',
        success: `Minero ${isEditing ? 'actualizado' : 'creado'}.`,
        error: 'Ocurrió un error al guardar el minero.',
      });
      fetchMiners();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar.');
    }
  };

  const handleDeleteMiner = async (minerId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este minero? Esta acción es irreversible.")) return;
    try {
      await toast.promise(api.delete(`/admin/miners/${minerId}`), {
        loading: 'Eliminando minero...',
        success: 'Minero eliminado.',
        error: 'Ocurrió un error al eliminar.',
      });
      fetchMiners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar.');
    }
  };

  return (
    <>
      <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Gestión de Mineros</h1>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 font-bold text-white bg-accent-start rounded-lg hover:bg-accent-end transition-colors">
            Crear Minero
          </button>
        </div>
        {isLoading ? <div className="h-64 flex items-center justify-center"><Loader /></div> : miners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miners.map(miner => (
              <div key={miner._id} className="bg-dark-primary p-4 rounded-lg border border-white/10 flex flex-col justify-between shadow-lg">
                <img src={miner.imageUrl || 'https://i.postimg.cc/8PqYj4zR/nicebot.jpg'} alt={miner.name} className="w-full h-32 object-contain rounded-t-lg mb-4 bg-black/20" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{miner.name}</h3>
                  <div className="text-sm text-text-secondary space-y-1 mt-2">
                    <p>Precio: <span className="font-mono text-white">{miner.price} USDT</span></p>
                    <p>Producción: <span className="font-mono text-white">{miner.dailyProduction} USDT/Día</span></p>
                    <p>Duración: <span className="font-mono text-white">{miner.durationDays} días</span></p>
                    <p>Gratuito: <span className={`font-mono ${miner.isFree ? 'text-green-400' : 'text-red-400'}`}>{miner.isFree ? 'Sí' : 'No'}</span></p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button onClick={() => handleOpenModal(miner)} className="flex-1 px-3 py-1.5 text-xs flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors"><HiPencil /> Editar</button>
                  <button onClick={() => handleDeleteMiner(miner._id)} className="flex-1 px-3 py-1.5 text-xs flex items-center justify-center gap-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors"><HiTrash /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <HiOutlineCubeTransparent className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-lg font-medium">No hay Mineros creados</h3>
            <p className="mt-1 text-sm">Empieza por crear tu primer minero.</p>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isModalOpen && <MinerFormModal miner={editingMiner} onClose={handleCloseModal} onSave={handleSaveMiner} />}
      </AnimatePresence>
    </>
  );
};

export default AdminMinersPage;