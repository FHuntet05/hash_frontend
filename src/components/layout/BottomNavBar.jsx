// RUTA: frontend/src/components/layout/BottomNavBar.jsx (DISEÑO CRISTALINO FINAL)

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
            end={to === '/home'} // 'end' para que /home no coincida con otras rutas que no son exactas
            className="flex-1 flex justify-center items-center h-full"
        >
            {({ isActive }) => (
                <div className={`relative flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors duration-300 rounded-lg ${isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                    {isActive ? <IconSolid className="w-6 h-6" /> : <IconOutline className="w-6 h-6" />}
                    <span className={`text-xs font-semibold transition-all duration-300 ${isActive ? 'scale-100' : 'scale-90 opacity-0'}`}>{label}</span>
                    <span className={`absolute top-1/2 -translate-y-1/2 text-xs font-semibold transition-all duration-300 ${isActive ? 'scale-0 opacity-0' : 'scale-100'}`}>{label}</span>
                </div>
            )}
        </NavLink>
    );
};


const BottomNavBar = () => {
    const { t } = useTranslation();

    const navItems = [
        { to: '/home', label: t('nav.home', 'Mío'), IconOutline: HiOutlineHome, IconSolid: HiMiniHome },
        { to: '/ranking', label: t('nav.ranking', 'Clasificación'), IconOutline: HiOutlineChartBar, IconSolid: HiMiniChartBar },
        { to: '/factories', label: t('nav.factories', 'Tienda'), IconOutline: HiOutlineBuildingStorefront, IconSolid: HiMiniBuildingStorefront },
        { to: '/team', label: t('nav.team', 'Equipo'), IconOutline: HiOutlineUserGroup, IconSolid: HiMiniUserGroup },
        { to: '/profile', label: t('nav.profile', 'A mí'), IconOutline: HiOutlineUserCircle, IconSolid: HiMiniUserCircle },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 p-3 z-50">
            <nav 
                className="max-w-lg mx-auto h-16 bg-card/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-medium"
                style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
            >
                <div className="flex justify-around items-center h-full">
                    {navItems.map(item => <NavItem key={item.to} {...item} />)}
                </div>
            </nav>
        </div>
    );
};

export default BottomNavBar;