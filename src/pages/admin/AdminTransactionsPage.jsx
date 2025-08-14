// RUTA: frontend/src/pages/admin/AdminTransactionsPage.jsx (CORRECCIÓN DE ÍCONO)

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import Loader from '../../components/common/Loader';
// --- INICIO DE CORRECCIÓN ---
import { HiOutlineReceiptRefund, HiMagnifyingGlass } from 'react-icons/hi2'; // Corregido: HiOutlineSearch -> HiMagnifyingGlass
// --- FIN DE CORRECCIÓN ---


// Mapeo de colores y textos para los tipos de transacción
const transactionTypeInfo = {
  deposit: { label: 'Depósito', color: 'bg-green-500/20 text-green-300' },
  withdrawal: { label: 'Retiro', color: 'bg-red-500/20 text-red-300' },
  purchase: { label: 'Compra', color: 'bg-blue-500/20 text-blue-300' },
  production_claim: { label: 'Reclamo Prod.', color: 'bg-teal-500/20 text-teal-300' },
  referral_commission: { label: 'Comisión Ref.', color: 'bg-purple-500/20 text-purple-300' },
  task_reward: { label: 'Recompensa Tarea', color: 'bg-indigo-500/20 text-indigo-300' },
  admin_credit: { label: 'Crédito Admin', color: 'bg-sky-500/20 text-sky-300' },
  admin_debit: { label: 'Débito Admin', color: 'bg-orange-500/20 text-orange-300' },
  default: { label: 'Desconocido', color: 'bg-gray-500/20 text-gray-300' }
};

const TransactionTypeBadge = ({ type }) => {
  const { label, color } = transactionTypeInfo[type] || transactionTypeInfo.default;
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{label}</span>;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-between items-center mt-4 text-sm">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 rounded bg-dark-tertiary disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
            <span className="text-text-secondary">Página {currentPage} de {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 rounded bg-dark-tertiary disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
        </div>
    );
};

const AdminTransactionsPage = () => {
  const [data, setData] = useState({ transactions: [], page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [filterType, setFilterType] = useState('');

  const fetchTransactions = useCallback(async (page, search, type) => {
    setIsLoading(true);
    try {
      const { data: responseData } = await api.get('/admin/transactions', {
        params: {
          page: page,
          search: search || undefined,
          type: type || undefined
        }
      });
      setData(responseData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al obtener las transacciones.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(currentPage, debouncedSearchTerm, filterType);
  }, [currentPage, debouncedSearchTerm, filterType, fetchTransactions]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= data.pages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setCurrentPage(1);
    setFilterType(e.target.value);
  };

  return (
    <div className="space-y-6">
        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
            <h1 className="text-2xl font-semibold mb-1 flex items-center gap-3"><HiOutlineReceiptRefund /> Historial de Transacciones</h1>
            <p className="text-text-secondary">Revisa todas las transacciones financieras que ocurren en la plataforma.</p>
        </div>

        <div className="bg-dark-secondary p-6 rounded-lg border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full md:max-w-xs">
                    {/* --- INICIO DE CORRECCIÓN --- */}
                    <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    {/* --- FIN DE CORRECCIÓN --- */}
                    <input type="text" placeholder="Buscar por nombre o ID..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 bg-dark-primary text-white rounded-lg border-2 border-transparent focus:border-accent-start focus:outline-none" />
                </div>
                <select onChange={handleFilterChange} value={filterType} className="w-full md:w-auto bg-dark-primary p-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-start">
                    <option value="">Todos los Tipos</option>
                    {Object.entries(transactionTypeInfo).filter(([key]) => key !== 'default').map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {isLoading ? <div className="h-96 flex items-center justify-center"><Loader text="Cargando transacciones..." /></div> : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-text-secondary uppercase bg-dark-tertiary">
                                <tr>
                                    <th className="p-3">Usuario</th>
                                    <th className="p-3">Tipo</th>
                                    <th className="p-3 text-right">Monto</th>
                                    <th className="p-3">Descripción</th>
                                    <th className="p-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {data.transactions.length > 0 ? data.transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-dark-tertiary">
                                        <td className="p-3 font-medium">
                                          {tx.user ? (
                                            <Link to={`/admin/users/${tx.user._id}/details`} className="hover:text-accent-start">{tx.user.username}</Link>
                                          ) : (
                                            'Sistema'
                                          )}
                                        </td>
                                        <td className="p-3"><TransactionTypeBadge type={tx.type} /></td>
                                        <td className={`p-3 text-right font-mono ${tx.amount > 0 || tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency}
                                        </td>
                                        <td className="p-3 text-sm text-text-secondary">{tx.description}</td>
                                        <td className="p-3 text-sm text-text-secondary whitespace-nowrap">{new Date(tx.createdAt).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center p-8 text-text-secondary">No se encontraron transacciones con los filtros actuales.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={data.page} totalPages={data.pages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    </div>
  );
};

export default AdminTransactionsPage;