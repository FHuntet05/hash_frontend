// --- START OF FILE AdminWithdrawalsPage.jsx ---

// frontend/src/pages/admin/AdminWithdrawalsPage.jsx (v18.1 - CORRECCIÓN DE ACCESO A METADATA)

import React, { useState, useEffect, useCallback } from 'react';
import useAdminStore from '../../store/adminStore';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { HiOutlineClipboardDocument, HiOutlineClipboardDocumentCheck } from 'react-icons/hi2';

const AmountCell = ({ withdrawal }) => {
  const { grossAmount, feeAmount, netAmount } = withdrawal;
  return (
    <div className="font-mono">
      <p className="font-bold text-lg text-green-400">{netAmount?.toFixed(2) || 'N/A'}</p>
      <p className="text-xs text-text-secondary mt-1">
        Solicitado: {grossAmount?.toFixed(2) || 'N/A'}
      </p>
      <p className="text-xs text-text-secondary">
        Comisión: -{feeAmount?.toFixed(2) || 'N/A'}
      </p>
    </div>
  );
};

const WithdrawalsTable = ({ withdrawals, onProcess, processingId }) => {
  const [copiedAddress, setCopiedAddress] = useState('');

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    toast.success('Dirección copiada!');
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  return (
    <div className="overflow-x-auto bg-dark-secondary rounded-lg border border-white/10">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-text-secondary uppercase bg-black/20">
          <tr>
            <th className="px-6 py-3">Usuario</th>
            <th className="px-6 py-3">Monto a Pagar (USDT)</th>
            <th className="px-6 py-3">Dirección de Retiro</th>
            <th className="px-6 py-3">Fecha Solicitud</th>
            <th className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((tx) => (
            <tr key={tx._id} className="border-b border-dark-primary hover:bg-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img className="w-8 h-8 rounded-full" src={tx.user?.photoUrl || '/assets/images/placeholder.png'} alt="avatar" />
                  <span>{tx.user?.username || 'Usuario no encontrado'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <AmountCell withdrawal={tx} />
              </td>
              <td className="px-6 py-4 font-mono text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-xs">{tx.walletAddress || 'N/A'}</span>
                  {tx.walletAddress && (
                    <button onClick={() => handleCopy(tx.walletAddress)} className="text-gray-400 hover:text-white">
                      {copiedAddress === tx.walletAddress ? <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-green-400" /> : <HiOutlineClipboardDocument className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleString('es-ES')}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onProcess(tx._id, 'completed')} disabled={!!processingId} className="px-3 py-1.5 text-xs font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50">
                    {processingId === tx._id ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button onClick={() => onProcess(tx._id, 'rejected')} disabled={!!processingId} className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50">
                    Rechazar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchWithdrawals = useCallback(async (targetPage = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/admin/withdrawals/pending?page=${targetPage}`);
      
      // --- INICIO DE CORRECCIÓN CRÍTICA ---
      // Se transforman los datos aquí para aplanar la estructura.
      const transformedWithdrawals = data.withdrawals.map(tx => ({
        ...tx,
        netAmount: tx.metadata?.netAmount,
        feeAmount: tx.metadata?.feeAmount,
        grossAmount: Math.abs(tx.amount), // El monto solicitado es el 'amount' de la transacción
        walletAddress: tx.metadata?.walletAddress
      }));
      // --- FIN DE CORRECCIÓN CRÍTICA ---

      setWithdrawals(transformedWithdrawals);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      const requestedPath = err.config?.url || 'desconocida';
      const errorMessage = `Error al obtener datos de la ruta: ${requestedPath}`;
      console.error("Error al obtener retiros:", err);
      setError(errorMessage);
      toast.error("Error al cargar las solicitudes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals(1);
  }, [fetchWithdrawals]);

  const handleProcessWithdrawal = async (txId, status) => {
    setProcessingId(txId);
    let notes = '';
    
    if (status === 'rejected') {
      notes = window.prompt("Por favor, introduce el motivo del rechazo (se devolverán los fondos al usuario):");
      if (notes === null) {
        setProcessingId(null);
        return;
      }
    } else if (status === 'completed') {
      if (!window.confirm("¿Estás SEGURO de que quieres APROBAR este retiro? Esta acción es para confirmar que ya has enviado los fondos manualmente desde tu exchange. Esta acción es IRREVERSIBLE.")) {
        setProcessingId(null);
        return;
      }
    }
    
    const processPromise = api.put(`/admin/withdrawals/${txId}/process`, { status, adminNotes: notes });

    try {
        await toast.promise(processPromise, {
            loading: 'Actualizando estado en la base de datos...',
            success: (res) => {
                fetchWithdrawals(page);
                return res.data.message || `Retiro procesado como "${status}".`;
            },
            error: (err) => err.response?.data?.message || 'No se pudo procesar el retiro.'
        });
    } catch (error) {
        console.error("Error al procesar retiro:", error);
    } finally {
        setProcessingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-96"><Loader text="Cargando solicitudes..." /></div>;
    }
    if (error) {
      return <div className="text-center py-16 text-red-400"><p className="font-mono bg-black/20 p-4 rounded-lg">{error}</p></div>;
    }
    if (withdrawals.length > 0) {
      return (
        <>
          <WithdrawalsTable withdrawals={withdrawals} onProcess={handleProcessWithdrawal} processingId={processingId} />
          {pages > 1 && (
            <div className="mt-6 text-center">
              {/* Aquí se podría implementar la paginación */}
            </div>
          )}
        </>
      );
    }
    return (
      <div className="text-center py-16 text-text-secondary">
        <p>¡Buen trabajo! No hay solicitudes de retiro pendientes.</p>
      </div>
    );
  };

  return (
    <div className="bg-dark-secondary p-6 rounded-lg border border-white/10 text-white">
      <h1 className="text-2xl font-semibold mb-4">Solicitudes de Retiro Pendientes</h1>
      {renderContent()}
    </div>
  );
};

export default AdminWithdrawalsPage;

// --- END OF FILE AdminWithdrawalsPage.jsx ---