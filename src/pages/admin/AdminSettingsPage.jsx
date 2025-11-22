// RUTA: frontend/src/pages/admin/AdminSettingsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { HiUsers, HiCurrencyDollar, HiCog, HiShieldCheck } from 'react-icons/hi2';

// Componente Toggle Reutilizable
const SettingToggle = ({ id, name, checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4">
        <div className="pr-4">
            <label htmlFor={id} className="font-bold text-white">{label}</label>
            {description && <p className="text-xs text-text-secondary mt-1">{description}</p>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-accent/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
        </label>
    </div>
);

// Componente Input Simple
const SettingInput = ({ label, name, value, onChange, type = "text", step, suffix }) => (
    <div>
        <label htmlFor={name} className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">{label}</label>
        <div className="relative">
            <input 
                type={type} 
                id={name} 
                name={name} 
                value={value} 
                onChange={onChange} 
                step={step}
                className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-accent focus:outline-none transition-colors font-mono"
            />
            {suffix && <span className="absolute right-4 top-3 text-text-secondary text-sm">{suffix}</span>}
        </div>
    </div>
);

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/admin/settings');
      // Asegurar que referralPercentages exista para evitar crash
      if (!data.referralPercentages) {
          data.referralPercentages = { level1: 0, level2: 0, level3: 0 };
      }
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

  // Handler para campos simples
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handler Específico para los Porcentajes de Referidos (Objeto anidado)
  const handleReferralChange = (e, level) => {
      const val = parseFloat(e.target.value) || 0;
      setSettings(prev => ({
          ...prev,
          referralPercentages: {
              ...prev.referralPercentages,
              [`level${level}`]: val
          }
      }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const settingsToSave = {
      ...settings,
      minWithdrawal: Number(settings.minWithdrawal),
      withdrawalFeePercent: Number(settings.withdrawalFeePercent),
      // Nos aseguramos de enviar los porcentajes numéricos correctos
      referralPercentages: {
          level1: Number(settings.referralPercentages.level1),
          level2: Number(settings.referralPercentages.level2),
          level3: Number(settings.referralPercentages.level3),
      }
    };

    try {
      await toast.promise(
        api.put('/admin/settings', settingsToSave),
        {
          loading: 'Aplicando cambios...',
          success: '¡Configuración actualizada!',
          error: 'Error al guardar.',
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-full"><Loader text="Cargando Sistema..." /></div>;
  if (!settings) return <div className="text-center text-red-400">Error crítico al cargar configuración.</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 p-4 pb-24 max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <HiCog className="text-accent"/> Configuración Global
      </h1>

      {/* 1. SECCIÓN REFERIDOS (NUEVO) */}
      <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-4 border-b border-white/5">
            <HiUsers className="text-accent" /> Sistema de Comisiones (Depósitos)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-xs font-bold text-text-secondary mb-2 uppercase">Nivel 1 (Directo)</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={settings.referralPercentages?.level1 || 0}
                        onChange={(e) => handleReferralChange(e, 1)}
                        className="w-full p-3 bg-accent/10 border border-accent/30 rounded-xl text-white font-bold text-center text-xl focus:border-accent outline-none"
                    />
                    <span className="absolute right-4 top-4 text-accent font-bold">%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 text-center">Comisión pagada al padre</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-text-secondary mb-2 uppercase">Nivel 2</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={settings.referralPercentages?.level2 || 0}
                        onChange={(e) => handleReferralChange(e, 2)}
                        className="w-full p-3 bg-background border border-white/10 rounded-xl text-white font-bold text-center text-xl focus:border-accent outline-none"
                    />
                    <span className="absolute right-4 top-4 text-gray-500">%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 text-center">Comisión al abuelo</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-text-secondary mb-2 uppercase">Nivel 3</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={settings.referralPercentages?.level3 || 0}
                        onChange={(e) => handleReferralChange(e, 3)}
                        className="w-full p-3 bg-background border border-white/10 rounded-xl text-white font-bold text-center text-xl focus:border-accent outline-none"
                    />
                    <span className="absolute right-4 top-4 text-gray-500">%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 text-center">Comisión al bisabuelo</p>
            </div>
        </div>
      </div>

      {/* 2. CONTROLES GENERALES */}
      <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-white/5 pb-4">
            <HiShieldCheck className="text-green-500" /> Controles de Acceso
        </h2>
        <div className="divide-y divide-white/5">
          <SettingToggle 
            id="maintenanceMode"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            label="Modo Mantenimiento"
            description="Si se activa, nadie podrá acceder a la App (Pantalla de Mantenimiento)."
          />
          <SettingToggle 
            id="withdrawalsEnabled"
            name="withdrawalsEnabled"
            checked={settings.withdrawalsEnabled}
            onChange={handleChange}
            label="Habilitar Retiros"
            description="Control maestro para permitir o pausar todos los retiros globales."
          />
        </div>
      </div>

      {/* 3. FINANZAS */}
      <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
            <HiCurrencyDollar className="text-yellow-500" /> Parámetros Financieros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <SettingInput 
            label="Monto Mínimo de Retiro"
            name="minWithdrawal"
            value={settings.minWithdrawal}
            onChange={handleChange}
            type="number"
            step="0.1"
            suffix="USDT"
          />
          <SettingInput 
            label="Fee / Comisión de Retiro"
            name="withdrawalFeePercent"
            value={settings.withdrawalFeePercent}
            onChange={handleChange}
            type="number"
            step="0.1"
            suffix="%"
          />
        </div>
        
        <div className="bg-background/50 p-4 rounded-xl border border-white/5 mt-2">
            <SettingToggle 
                id="forcePurchaseOnAllWithdrawals"
                name="forcePurchaseOnAllWithdrawals"
                checked={settings.forcePurchaseOnAllWithdrawals}
                onChange={handleChange}
                label="Forzar Inversión para Retirar"
                description="Bloquea retiros a usuarios que SOLO tengan el plan gratuito. Deben comprar al menos 1 vez."
            />
        </div>
      </div>

      {/* BOTÓN FLOTANTE EN MÓVIL, FIJO EN PC */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#111827]/90 backdrop-blur-md border-t border-white/10 md:relative md:bg-transparent md:border-0 md:p-0 z-40 flex justify-end">
        <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-transform active:scale-95"
        >
          GUARDAR CONFIGURACIÓN
        </button>
      </div>
    </form>
  );
};

export default AdminSettingsPage;