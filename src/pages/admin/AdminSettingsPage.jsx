// RUTA: frontend/src/pages/admin/AdminSettingsPage.jsx (CON CONTROL DE RETIROS)

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const SettingToggle = ({ id, name, checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <label htmlFor={id} className="font-medium text-white">{label}</label>
            {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-accent-start peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-start"></div>
        </label>
    </div>
);

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/admin/settings');
      setSettings(data);
    } catch (error) {
      toast.error('No se pudo cargar la configuración.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const settingsToSave = {
      ...settings,
      minimumWithdrawal: Number(settings.minimumWithdrawal),
      withdrawalFeePercent: Number(settings.withdrawalFeePercent),
    };

    try {
      await toast.promise(
        api.put('/admin/settings', settingsToSave),
        {
          loading: 'Guardando configuración...',
          success: '¡Configuración guardada exitosamente!',
          error: 'Error al guardar la configuración.',
        }
      );
    } catch (error) {
      // El toast ya maneja el mensaje de error
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader text="Cargando configuración..." /></div>;
  }

  if (!settings) {
    return <div className="text-center text-red-400">No se pudo cargar la configuración.</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Sección de Controles Generales */}
      <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Controles Generales</h2>
        <div className="space-y-4 divide-y divide-white/10">
          <SettingToggle 
            id="maintenanceMode"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            label="Modo Mantenimiento"
            description="Desactiva el acceso a la aplicación para los usuarios."
          />
          {settings.maintenanceMode && (
            <div className="pt-4">
              <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-text-secondary mb-1">Mensaje de Mantenimiento</label>
              <input type="text" id="maintenanceMessage" name="maintenanceMessage" value={settings.maintenanceMessage} onChange={handleChange} className="w-full p-2 bg-black/20 rounded-md" />
            </div>
          )}
           {/* --- NUEVO INTERRUPTOR --- */}
          <SettingToggle 
            id="withdrawalsEnabled"
            name="withdrawalsEnabled"
            checked={settings.withdrawalsEnabled}
            onChange={handleChange}
            label="Habilitar Retiros"
            description="Permite o bloquea todas las solicitudes de retiro en la plataforma."
          />
           {/* --- FIN DE NUEVO INTERRUPTOR --- */}
        </div>
      </div>

      {/* Sección de Parámetros Financieros */}
      <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Parámetros Financieros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="minimumWithdrawal" className="block text-sm font-medium text-text-secondary mb-1">Monto Mínimo de Retiro (USDT)</label>
            <input type="number" id="minimumWithdrawal" name="minimumWithdrawal" value={settings.minimumWithdrawal} onChange={handleChange} className="w-full p-2 bg-black/20 rounded-md" step="0.01" />
          </div>
          <div>
            <label htmlFor="withdrawalFeePercent" className="block text-sm font-medium text-text-secondary mb-1">Comisión de Retiro (%)</label>
            <input type="number" id="withdrawalFeePercent" name="withdrawalFeePercent" value={settings.withdrawalFeePercent} onChange={handleChange} className="w-full p-2 bg-black/20 rounded-md" step="0.1" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-8 py-3 font-bold text-white bg-gradient-to-r from-accent-start to-accent-end rounded-lg hover:opacity-90 transition-opacity">
          Guardar Configuración
        </button>
      </div>
    </form>
  );
};

export default AdminSettingsPage;