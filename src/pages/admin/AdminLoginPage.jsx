// frontend/src/pages/admin/AdminLoginPage.jsx (CON FLUJO DE RESETEO FORZADO)
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAdminStore from '../../store/adminStore';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineKey } from 'react-icons/hi2';
import api from '../../api/axiosConfig';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');

  const [step, setStep] = useState('credentials'); // 'credentials', '2fa', 'resetPassword'
  const [userId, setUserId] = useState(null);

  const { login, completeTwoFactorLogin, isLoading, setAdminAndToken } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Por favor, ingresa usuario y contraseña.');
    
    const result = await login(username, password);
    if (result.success) {
      if (result.passwordResetRequired) {
        setStep('resetPassword');
        return;
      }
      if (result.twoFactorRequired) {
        setUserId(result.userId);
        setStep('2fa');
      } else {
        toast.success('¡Bienvenido, Administrador!');
        navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
      }
    } else {
      toast.error(result.message);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Las contraseñas no coinciden.');
    if (newPassword.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres.');

    // Esta lógica asumirá que el token del login inicial (con passwordResetRequired) se mantiene
    // en la cabecera por el interceptor para autorizar esta petición.
    const promise = api.put('/auth/admins/update-password', { newPassword });
    
    toast.promise(promise, {
        loading: 'Actualizando contraseña...',
        success: (response) => {
            // El backend debería devolver un nuevo token y datos de admin actualizados
            setAdminAndToken(response.data.token, response.data.admin);
            navigate('/admin/dashboard', { replace: true });
            return 'Contraseña actualizada. ¡Bienvenido!';
        },
        error: (err) => err.response?.data?.message || 'No se pudo actualizar la contraseña.'
    });
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    if (!twoFactorToken) return toast.error('Por favor, ingresa tu código de 6 dígitos.');
    
    const result = await completeTwoFactorLogin(userId, twoFactorToken);
    if (result.success) {
      toast.success('¡Bienvenido, Administrador!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-primary text-white p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-dark-secondary rounded-2xl shadow-lg border border-white/10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-accent-start">Nov Mining Bot</h1>
          <p className="text-lg text-text-secondary">Panel de Administración</p>
        </div>
        
        {step === 'credentials' && (
          <form onSubmit={handleCredentialSubmit} className="space-y-6">
            <div className="relative"><HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" /><input type="text" placeholder="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 rounded-lg"/></div>
            <div className="relative"><HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" /><input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 rounded-lg"/></div>
            <button type="submit" disabled={isLoading} className="w-full py-3 font-bold text-white bg-gradient-to-r from-accent-start to-accent-end rounded-lg disabled:opacity-50">{isLoading ? 'Verificando...' : 'Iniciar Sesión'}</button>
          </form>
        )}

        {step === '2fa' && (
          <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
            <p className="text-center text-text-secondary">Introduce el código de 6 dígitos de tu aplicación de autenticación.</p>
            <div className="relative"><HiOutlineKey className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" /><input type="text" placeholder="Código 2FA" value={twoFactorToken} onChange={(e) => setTwoFactorToken(e.target.value)} maxLength="6" className="w-full pl-12 pr-4 py-3 bg-black/20 rounded-lg text-center text-2xl tracking-[.5em]"/></div>
            <button type="submit" disabled={isLoading} className="w-full py-3 font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg disabled:opacity-50">{isLoading ? 'Verificando...' : 'Confirmar Código'}</button>
          </form>
        )}

        {step === 'resetPassword' && (
          <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
            <h2 className="text-center text-xl font-bold">Cambio de Contraseña Requerido</h2>
            <p className="text-center text-sm text-text-secondary">Por seguridad, debes establecer una nueva contraseña personal.</p>
            <div className="relative"><HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" /><input type="password" placeholder="Nueva Contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 rounded-lg"/></div>
            <div className="relative"><HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" /><input type="password" placeholder="Confirmar Nueva Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 rounded-lg"/></div>
            <button type="submit" disabled={isLoading} className="w-full py-3 font-bold text-white bg-gradient-to-r from-accent-start to-accent-end rounded-lg disabled:opacity-50">{isLoading ? 'Guardando...' : 'Establecer Contraseña'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;