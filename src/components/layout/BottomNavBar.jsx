// RUTA: frontend/src/components/layout/BottomNavBar.jsx (RECONSTRUCCIÓN FINAL - ANCLADO Y LIMPIO)

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
            // El 'group' ya no es necesario con este diseño más simple
            className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full pt-2 pb-1 transition-colors duration-200
                ${isActive 
                    ? 'text-accent-primary' 
                    : 'text-text-secondary hover:text-text-primary'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {/* El ícono siempre es visible */}
                    {isActive ? <IconSolid className="w-6 h-6" /> : <IconOutline className="w-6 h-6" />}
                    {/* El texto siempre es visible debajo del ícono */}
                    <span className="text-xs mt-1 font-medium">{label}</span>
                </>
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
        // Se elimina el 'div' contenedor con padding.
        // El 'nav' ahora está anclado a la parte inferior.
        <nav 
            className="fixed bottom-0 left-0 right-0 h-16 max-w-lg mx-auto bg-card/80 backdrop-blur-lg border-t border-white/20"
            style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
        >
            <div className="flex justify-around items-center h-full">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </div>
        </nav>
    );
};

export default BottomNavBar;