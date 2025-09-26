<<<<<<< HEAD
// RUTA: frontend/src/components/layout/BottomNavBar.jsx (v2.0 - REDISEÑO FINO CON EMOJIS)
=======
// RUTA: frontend/src/components/layout/BottomNavBar.jsx (v2.1 - IMPORTACIÓN CORREGIDA)
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503

import React from 'react';
import { NavLink } from 'react-router-dom';
// --- CORRECCIÓN QUIRÚRGICA ---
// Se ha corregido "react-i-next" a "react-i18next".
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
=======
// --- FIN DE LA CORRECCIÓN ---
import {
    HiOutlineHome, HiMiniHome,
    HiOutlineRectangleStack, HiMiniRectangleStack, 
    HiOutlineBuildingStorefront, HiMiniBuildingStorefront,
    HiOutlineUserGroup, HiMiniUserGroup,
    HiOutlineUserCircle, HiMiniUserCircle
} from 'react-icons/hi2';
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503

// Componente NavItem rediseñado para soportar emojis y la nueva estética.
const NavItem = ({ to, label, emoji }) => {
    return (
        <NavLink
            to={to}
            end={to === '/home'}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full pt-1 transition-all duration-200 ease-in-out transform
                ${isActive 
                    ? 'text-accent' // Aplica el color azul al texto si está activo
                    : 'text-text-secondary hover:text-text-primary' // Grises para inactivos, blanco en hover
                }`
            }
        >
            {({ isActive }) => (
                <>
<<<<<<< HEAD
                    <span 
                        className={`text-2xl transition-transform duration-200 ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}
                    >
                        {emoji}
                    </span>
                    <span className="text-[10px] mt-0.5 font-semibold tracking-wide">{label}</span>
=======
                    {isActive ? <IconSolid className="w-6 h-6" /> : <IconOutline className="w-6 h-6" />}
                    <span className="text-xs mt-1 font-medium">{label}</span>
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
                </>
            )}
        </NavLink>
    );
};

const BottomNavBar = () => {
    const { t } = useTranslation();

    const navItems = [
<<<<<<< HEAD
        { to: '/home', label: t('nav.home', 'Inicio'), emoji: '🏠' }, // Antes "Mío", ahora Minería
        { to: '/ranking', label: t('nav.ranking', 'Top'), emoji: '🏆' }, // Antes "Clasificación"
        { to: '/factories', label: t('nav.market', 'Mercado'), emoji: '⛏️' }, // Antes "Tienda"
        { to: '/team', label: t('nav.team', 'Equipo'), emoji: '👥' },
        { to: '/profile', label: t('nav.profile', 'Perfil'), emoji: '👤' }, // Antes "A mí"
=======
        { to: '/home', label: t('nav.home', 'Inicio'), IconOutline: HiOutlineHome, IconSolid: HiMiniHome },
        { 
            to: '/deposit-history', 
            label: t('nav.history', 'Historial'), 
            IconOutline: HiOutlineRectangleStack, 
            IconSolid: HiMiniRectangleStack 
        },
        { to: '/factories', label: t('nav.factories', 'Tienda'), IconOutline: HiOutlineBuildingStorefront, IconSolid: HiMiniBuildingStorefront },
        { to: '/team', label: t('nav.team', 'Equipo'), IconOutline: HiOutlineUserGroup, IconSolid: HiMiniUserGroup },
        { to: '/profile', label: t('nav.profile', 'Perfil'), IconOutline: HiOutlineUserCircle, IconSolid: HiMiniUserCircle },
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
    ];

    return (
        <nav 
<<<<<<< HEAD
            className="fixed bottom-0 left-0 right-0 h-14 max-w-lg mx-auto bg-surface/70 backdrop-blur-xl border-t border-border"
            style={{ WebkitBackdropFilter: 'blur(24px)', backdropFilter: 'blur(24px)' }}
=======
            className="fixed bottom-0 left-0 right-0 h-16 max-w-lg mx-auto bg-card/80 backdrop-blur-lg border-t border-border"
            style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
        >
            <div className="flex justify-around items-center h-full">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </div>
        </nav>
    );
};

export default BottomNavBar;