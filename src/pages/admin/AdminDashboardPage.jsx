// RUTA: frontend/src/pages/admin/AdminDashboardPage.jsx (VERSIÓN ESTABLE Y SINCRONIZADA)

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

import Loader from '../../components/common/Loader';
import StatCard from './components/StatCard';
import UserGrowthChart from './components/UserGrowthChart';

import { 
  HiOutlineUsers, 
  HiOutlineCurrencyDollar, 
  HiOutlineExclamationCircle, 
  HiOutlineBanknotes 
} from 'react-icons/hi2';

// --- INICIO DE LA MODIFICACIÓN CRÍTICA ---
// 1. Se define un estado inicial seguro para las estadísticas.
// Esto garantiza que 'stats' nunca sea 'null' y que todas sus propiedades
// existan desde el primer render, evitando el error 'toFixed of undefined'.
const initialStatsState = {
  totalUsers: 0,
  totalDepositVolume: 0,
  pendingWithdrawals: 0,
  centralWalletBalances: {
    usdt: 0,
    bnb: 0,
  },
  userGrowthData: [],
};
// --- FIN DE LA MODIFICACIÓN CRÍTICA ---

const AdminDashboardPage = () => {
  // 2. Se utiliza el estado inicial seguro.
  const [stats, setStats] = useState(initialStatsState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // No es necesario resetear isLoading a true aquí, ya que se inicializa en true.
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'No se pudieron cargar las estadísticas.');
        // En caso de error, el componente mostrará los valores del estado inicial (ceros).
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 3. La guardia de carga ahora funciona como se espera.
  // Si los datos aún no han llegado, se muestra el loader.
  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader text="Cargando estadísticas..." /></div>;
  }
  
  // 4. La guardia de 'stats' ya no es estrictamente necesaria gracias al estado inicial,
  // pero la mantenemos como una capa extra de seguridad.
  if (!stats) {
    return <div className="text-center text-text-secondary">No se pudieron cargar los datos del dashboard.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Usuarios" value={stats.totalUsers.toLocaleString('es-ES')} icon={HiOutlineUsers} />
        <StatCard title="Volumen Depósitos" value={`$${stats.totalDepositVolume.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={HiOutlineCurrencyDollar} />
        <StatCard title="Retiros Pendientes" value={stats.pendingWithdrawals.toLocaleString('es-ES')} icon={HiOutlineExclamationCircle} />
        
        <div className="bg-dark-primary p-6 rounded-lg border border-white/10">
            <div className="flex items-center gap-6">
                <div className="bg-accent-start/20 p-4 rounded-full"><HiOutlineBanknotes className="w-8 h-8 text-accent-start" /></div>
                <div>
                    <p className="text-sm text-text-secondary font-medium">Balance Billetera Central</p>
                    <div className="text-sm font-mono text-white mt-1">
                        {/* 5. Se accede a las propiedades de forma segura y se elimina la referencia a TRX. */}
                        <p>USDT: {stats.centralWalletBalances?.usdt?.toFixed(2) || '0.00'}</p>
                        <p>BNB: {stats.centralWalletBalances?.bnb?.toFixed(4) || '0.0000'}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Crecimiento de Usuarios (Últimos 14 días)</h2>
        <UserGrowthChart data={stats.userGrowthData || []} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;