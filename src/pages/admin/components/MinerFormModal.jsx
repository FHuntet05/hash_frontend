// RUTA: frontend/src/pages/admin/components/FactoryFormModal.jsx (CORREGIDO)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const modalVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 }
};

const FactoryFormModal = ({ factory, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    vipLevel: '', // <-- CAMBIO: Añadido al estado inicial
    price: '',
    dailyProduction: '',
    durationDays: '',
    imageUrl: '',
    isFree: false
  });
  const isEditing = !!factory;

  useEffect(() => {
    if (factory) {
      setFormData({
        name: factory.name || '',
        vipLevel: factory.vipLevel || '', // <-- CAMBIO: Se carga el valor al editar
        price: factory.price || '',
        dailyProduction: factory.dailyProduction || '',
        durationDays: factory.durationDays || '',
        imageUrl: factory.imageUrl || '',
        isFree: factory.isFree || false
      });
    }
  }, [factory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
        ...formData,
        vipLevel: Number(formData.vipLevel), // <-- CAMBIO: Se convierte a número
        price: Number(formData.price),
        dailyProduction: Number(formData.dailyProduction),
        durationDays: Number(formData.durationDays)
    };
    onSave(dataToSend, factory?._id);
  };

  return (
    <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
      <motion.div variants={modalVariants} onClick={(e) => e.stopPropagation()} className="relative bg-dark-secondary rounded-2xl border border-white/10 w-full max-w-lg text-white">
        <header className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">{isEditing ? 'Editar Fábrica' : 'Crear Nueva Fábrica'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><HiXMark className="w-6 h-6" /></button>
        </header>
        <form onSubmit={handleSubmit}>
          <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Nombre de la Fábrica</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 bg-black/20 rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium">Precio (USDT)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full mt-1 p-2 bg-black/20 rounded-md" step="0.01" required />
            </div>
            <div>
              <label className="text-sm font-medium">Producción Diaria (USDT/Día)</label>
              <input type="number" name="dailyProduction" value={formData.dailyProduction} onChange={handleChange} className="w-full mt-1 p-2 bg-black/20 rounded-md" step="0.01" required />
            </div>
            <div>
              <label className="text-sm font-medium">Duración (Días)</label>
              <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} className="w-full mt-1 p-2 bg-black/20 rounded-md" required />
            </div>
            {/* --- INICIO DE NUEVO CAMPO --- */}
            <div>
              <label className="text-sm font-medium">Nivel VIP</label>
              <input type="number" name="vipLevel" value={formData.vipLevel} onChange={handleChange} className="w-full mt-1 p-2 bg-black/20 rounded-md" required />
            </div>
            {/* --- FIN DE NUEVO CAMPO --- */}
             <div className="md:col-span-2 flex items-center justify-start gap-4 pt-2">
              <label htmlFor="isFree" className="text-sm font-medium">¿Es Gratuita?</label>
              <input type="checkbox" id="isFree" name="isFree" checked={formData.isFree} onChange={handleChange} className="h-5 w-5 rounded bg-black/20 text-accent-start focus:ring-accent-start border-gray-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">URL de Imagen</label>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full mt-1 p-2 bg-black/20 rounded-md" required />
            </div>
          </main>
          <footer className="p-6 border-t border-white/10 text-right">
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-accent-start to-accent-end text-white font-bold rounded-lg hover:opacity-90 transition-opacity">Guardar Cambios</button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
};
export default FactoryFormModal;