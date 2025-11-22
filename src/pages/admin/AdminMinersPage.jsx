import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiBolt, HiCurrencyDollar, HiClock } from 'react-icons/hi2';
import Loader from '../../components/common/Loader';
import MinerFormModal from './components/MinerFormModal'; // Asegúrate de tener este modal o adáptalo

const AdminMinersPage = () => {
  const [miners, setMiners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMiner, setEditingMiner] = useState(null);

  const fetchMiners = async () => {
    try {
      const { data } = await api.get('/miners'); // O /admin/miners según tu ruta
      setMiners(data);
    } catch (error) {
      toast.error('Error cargando potenciadores');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMiners(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este potenciador?')) return;
    try {
      await api.delete(`/admin/miners/${id}`);
      toast.success('Eliminado');
      fetchMiners();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleEdit = (miner) => {
    setEditingMiner(miner);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingMiner(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Potenciadores</h1>
        <button onClick={handleCreate} className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-accent/20">
          <HiPlus /> Nuevo
        </button>
      </div>

      {/* --- VISTA DE TABLA (PC) --- */}
      <div className="hidden md:block bg-surface rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-background text-xs uppercase font-bold text-text-secondary">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Prod. Diaria</th>
              <th className="p-4">Potencia (Sim)</th>
              <th className="p-4">Duración</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {miners.map(m => (
              <tr key={m._id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                    <img src={m.imageUrl} className="w-8 h-8 object-contain" alt="" />
                    {m.name}
                </td>
                <td className="p-4 text-green-400">{m.price} USDT</td>
                <td className="p-4 text-white">+{m.dailyProduction} USDT</td>
                <td className="p-4 text-accent font-mono">{(m.dailyProduction * 100).toFixed(0)} GH/s</td>
                <td className="p-4">{m.durationDays} Días</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(m)} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"><HiPencil /></button>
                  <button onClick={() => handleDelete(m._id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"><HiTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- VISTA DE TARJETAS (MÓVIL) --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {miners.map(m => (
          <div key={m._id} className="bg-surface p-4 rounded-xl border border-white/10 shadow-lg relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <img src={m.imageUrl} className="w-12 h-12 object-contain bg-background rounded-lg p-1" alt="" />
                    <div>
                        <h3 className="font-bold text-white text-lg">{m.name}</h3>
                        <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">Nivel {m.vipLevel}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(m)} className="p-2 bg-background border border-white/10 rounded-lg text-blue-400"><HiPencil /></button>
                    <button onClick={() => handleDelete(m._id)} className="p-2 bg-background border border-white/10 rounded-lg text-red-400"><HiTrash /></button>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-background/50 p-2 rounded border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase">Precio</p>
                    <p className="font-bold text-white">{m.price} USDT</p>
                </div>
                <div className="bg-background/50 p-2 rounded border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase">Diario</p>
                    <p className="font-bold text-green-400">+{m.dailyProduction}</p>
                </div>
                <div className="bg-background/50 p-2 rounded border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase">Potencia</p>
                    <p className="font-bold text-accent">{(m.dailyProduction * 100).toFixed(0)} GH/s</p>
                </div>
                <div className="bg-background/50 p-2 rounded border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase">Ciclo</p>
                    <p className="font-bold text-white">{m.durationDays} Días</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <MinerFormModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            miner={editingMiner} 
            onSuccess={fetchMiners} 
        />
      )}
    </div>
  );
};
export default AdminMinersPage;