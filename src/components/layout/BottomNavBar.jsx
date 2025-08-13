// RUTA: frontend/src/components/nav/BottomNav.jsx (REDISÉÑO COMPLETO "MEGA FÁBRICA")

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    HiOutlineHome, HiOutlineBuildingStorefront, HiOutlineUserGroup, HiOutlineUserCircle,
    HiMiniHome, HiMiniBuildingStorefront, HiMiniUserGroup, HiMiniUserCircle
} from 'react-icons/hi2';

const NavItem = ({ to, label, IconOutline, IconSolid }) => {
    return (
        <NavLink
            to={to}
            end={to === '/'} // 'end' prop para que '/' no coincida con otras rutas
            className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full pt-2 pb-1 transition-colors duration-200 ${
                    isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {/* Lógica simple: icono sólido si está activo, de contorno si no. */}
                    {isActive ? <IconSolid className="w-6 h-6" /> : <IconOutline className="w-6 h-6" />}
                    <span className="text-xs mt-1 font-medium">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNav = () => {
    const { t } = useTranslation();

    const navItems = [
        { to: '/', label: t('nav.home', 'Inicio'), IconOutline: HiOutlineHome, IconSolid: HiMiniHome },
        { to: '/factories', label: t('nav.factories', 'Tienda'), IconOutline: HiOutlineBuildingStorefront, IconSolid: HiMiniBuildingStorefront },
        { to: '/team', label: t('nav.team', 'Equipo'), IconOutline: HiOutlineUserGroup, IconSolid: HiMiniUserGroup },
        { to: '/profile', label: t('nav.profile', 'Perfil'), IconOutline: HiOutlineUserCircle, IconSolid: HiMiniUserCircle },
    ];

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/80 shadow-t-lg z-50"
            style={{
                // Aseguramos compatibilidad con navegadores más antiguos para el backdrop-filter
                WebkitBackdropFilter: 'blur(16px)',
                backdropFilter: 'blur(16px)',
            }}
        >
            <div className="flex justify-around items-center h-full max-w-lg mx-auto">
                {navItems.map(item => (
                    <NavItem key={item.to} {...item} />
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;