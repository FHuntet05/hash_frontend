// RUTA: frontend/src/components/layout/BottomNavBar.jsx (ANIMACIÓN Y ESTILO CORREGIDOS)

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
            end={to === '/home'}
            className="flex-1 flex justify-center items-center h-full group"
        >
            {({ isActive }) => (
                <div 
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all duration-300
                        ${isActive 
                            ? 'bg-accent-primary/10 text-accent-primary' 
                            : 'text-text-secondary group-hover:text-text-primary'
                        }`
                    }
                >
                    {isActive ? <IconSolid className="w-5 h-5" /> : <IconOutline className="w-5 h-5" />}
                    <span className={`text-sm font-bold transition-all duration-300 
                        ${isActive ? 'block' : 'hidden md:block'} `}
                    >
                        {label}
                    </span>
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
                <div className="flex justify-around items-center h-full px-2">
                    {navItems.map(item => <NavItem key={item.to} {...item} />)}
                </div>
            </nav>
        </div>
    );
};

export default BottomNavBar;