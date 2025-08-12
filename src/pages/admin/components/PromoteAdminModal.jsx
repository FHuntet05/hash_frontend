// RUTA: frontend/src/pages/admin/components/PromoteAdminModal.jsx (NUEVO)
import React, { useState } from 'react';
import { HiOutlineLockClosed, HiXMark } from 'react-icons/hi2';

const PromoteAdminModal = ({ user, onPromote, onClose }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        onPromote(user._id, password);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-secondary rounded-lg border border-white/10 shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Promover a Administrador</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><HiXMark className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p>Estás a punto de promover a <strong className="text-accent-start">{user.username}</strong> al rol de Administrador. </p>
                    <p className="text-sm text-text-secondary">Por favor, asigna una contraseña temporal segura. El usuario será forzado a cambiarla en su primer inicio de sesión.</p>
                    
                    <div>
                        <label className="text-sm font-bold text-text-secondary">Contraseña Temporal</label>
                        <div className="relative mt-1">
                            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-dark-primary rounded-lg border border-white/10"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-text-secondary">Confirmar Contraseña</label>
                         <div className="relative mt-1">
                            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-dark-primary rounded-lg border border-white/10"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-dark-tertiary hover:bg-white/10">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white">Promover Usuario</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromoteAdminModal;