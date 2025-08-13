// RUTA: frontend/src/components/layout/BottomNavBar.jsx (RECONSTRUIDO Y SINCRONIZADO)

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    HiOutlineHome, HiMiniHome,
    HiOutlineChartBar, HiMiniChartBar,
    HiOutlineBuildingStorefront, HiMiniBuildingStorefront,
    HiOutlineUserGroup, HiMiniUserGroup,
    HiOutlineUserCircle, HiMiniUserCircle
} from 'react-icons/hi2';

const NavItem = ({ to, label, IconOutline, IconSolid }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full pt-2 pb-1 transition-colors duration-200 group ${
                    isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive ? <IconSolid className="w-6 h-6" /> : <IconOutline className="w-6 h-6" />}
                    <span className="text-xs mt-1 font-medium">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNavBar = () => {
    const { t } = useTranslation();

    const navItems = [
        // RUTA CORREGIDA: Apunta a '/home'
        { to: '/home', label: t('nav.home', 'Inicio'), IconOutline: HiOutlineHome, IconSolid: HiMiniHome },
        // NUEVO: Ítem de Ranking añadido
        { to: '/ranking', label: t('nav.ranking', 'Ranking'), IconOutline: HiOutlineChartBar, IconSolid: HiMiniChartBar },
        { to: '/factories', label: t('nav.factories', 'Tienda'), IconOutline: HiOutlineBuildingStorefront, IconSolid: HiMiniBuildingStorefront },
        { to: '/team', label: t('nav.team', 'Equipo'), IconOutline: HiOutlineUserGroup, IconSolid: HiMiniUserGroup },
        { to: '/profile', label: t('nav.profile', 'Perfil'), IconOutline: HiOutlineUserCircle, IconSolid: HiMiniUserCircle },
    ];

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-border/80 shadow-t-lg z-50"
            style={{
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

export default BottomNavBar;