import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiXMark, HiCpuChip, HiCurrencyDollar, HiClock, HiBolt, HiGift } from 'react-icons/hi2';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

const MinerFormModal = ({ isOpen, onClose, miner, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    dailyProduction: '',
    durationDays: '',
    vipLevel: '',
    imageUrl: '',
    isFree: false, // Nuevo campo para el switch
  });

  useEffect(() => {
    if (miner) {
      setFormData({
        name: miner.name || '',
        price: miner.price || '',
        dailyProduction: miner.dailyProduction || '',
        durationDays: miner.durationDays || '',
        vipLevel: miner.vipLevel || '',
        imageUrl: miner.imageUrl || '',
        isFree: miner.isFree || false,
      });
    } else {
        // Resetear para nuevo
        setFormData({ 
            name: '', 
            price: '', 
            dailyProduction: '', 
            durationDays: '', 
            vipLevel: '', 
            imageUrl: '', 
            isFree: false 
        });
    }
  }, [miner]);

  // Manejador inteligente para inputs de texto y checkbox
  const handleChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica lógica
    if (formData.isFree && Number(formData.price) > 0) {
        if(!window.confirm("Has marcado este ítem como GRATIS pero tiene un PRECIO mayor a 0. \n\n¿Estás seguro? (Los usuarios nuevos lo recibirán sin pagar, pero en la tienda costará dinero).")) {
            return;
        }
    }

    try {
      if (miner) {
        await api.put(`/admin/miners/${miner._id}`, formData);
        toast.success('Potenciador actualizado');
      } else {
        await api.post('/admin/miners', formData);
        toast.success('Potenciador creado');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al guardar');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#111827]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HiCpuChip className="text-accent" /> 
                {miner ? 'Editar Potenciador' : 'Nuevo Potenciador'}
            </h2>
            <button onClick={onClose}><HiXMark className="w-6 h-6 text-text-secondary hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
            
            {/* --- SWITCH DE GRATUIDAD --- */}
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${formData.isFree ? 'bg-accent/10 border-accent/50' : 'bg-background border-border'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.isFree ? 'bg-accent text-white' : 'bg-gray-700 text-gray-400'}`}>
                        <HiGift className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${formData.isFree ? 'text-white' : 'text-text-secondary'}`}>
                            Modo Bienvenida
                        </p>
                        <p className="text-[10px] text-text-secondary">Se asigna gratis al registrarse</p>
                    </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="isFree" 
                        checked={formData.isFree} 
                        onChange={handleChange} 
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
            </div>

            {/* Nombre */}
            <div>
                <label className="text-xs font-bold text-text-secondary uppercase">Nombre del Modelo</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 bg-background border border-border rounded-lg p-3 text-white focus:border-accent outline-none" placeholder="Ej: Starter Rig v1" />
            </div>

            {/* Precio y Prod */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-text-secondary uppercase">Precio (USDT)</label>
                    <div className="relative mt-1">
                        <HiCurrencyDollar className="absolute left-3 top-3 text-text-secondary" />
                        <input 
                            type="number" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-background border border-border rounded-lg p-3 pl-9 text-white focus:border-accent outline-none" 
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-text-secondary uppercase">Prod. Diaria</label>
                    <div className="relative mt-1">
                        <HiBolt className="absolute left-3 top-3 text-green-500" />
                        <input 
                            type="number" 
                            step="0.000001" 
                            name="dailyProduction" 
                            value={formData.dailyProduction} 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-background border border-border rounded-lg p-3 pl-9 text-white focus:border-accent outline-none" 
                            placeholder="0.00"
                        />
                    </div>
                    {/* Preview de GH/s */}
                    {formData.dailyProduction > 0 && (
                        <p className="text-[10px] text-accent text-right mt-1">
                            ≈ {(formData.dailyProduction * 100).toFixed(1)} GH/s
                        </p>
                    )}
                </div>
            </div>

            {/* Duración y Nivel */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-text-secondary uppercase">Duración (Días)</label>
                    <div className="relative mt-1">
                        <HiClock className="absolute left-3 top-3 text-text-secondary" />
                        <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-3 pl-9 text-white focus:border-accent outline-none" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-text-secondary uppercase">Nivel VIP</label>
                    <input type="number" name="vipLevel" value={formData.vipLevel} onChange={handleChange} required className="w-full mt-1 bg-background border border-border rounded-lg p-3 text-white focus:border-accent outline-none" placeholder="0-5" />
                </div>
            </div>

            {/* Imagen */}
            <div>
                <label className="text-xs font-bold text-text-secondary uppercase">URL Imagen (Opcional)</label>
                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full mt-1 bg-background border border-border rounded-lg p-3 text-white focus:border-accent outline-none text-sm" placeholder="https://..." />
            </div>

            <button type="submit" className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg mt-4 transition-transform active:scale-[0.98]">
                GUARDAR CONFIGURACIÓN
            </button>
        </form>
      </motion.div>
    </div>
  );
};

export default MinerFormModal;