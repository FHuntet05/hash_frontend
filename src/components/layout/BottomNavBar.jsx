// RUTA: frontend/src/components/layout/BottomNavBar.jsx (v2.1 - RANKING RESTAURADO Y AJUSTES FINALES)

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Componente NavItem rediseñado para soportar emojis y la nueva estética.
const NavItem = ({ to, label, emoji }) => {
    return (
        <NavLink
            to={to}
            // `end` es importante para que la ruta de inicio ('/') no esté siempre activa
            end={to === '/home'}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full pt-1 transition-all duration-200 ease-in-out transform
                ${isActive 
                    ? 'text-accent' // Aplica el color azul (accent) al texto si está activo
                    : 'text-text-secondary hover:text-text-primary' // Grises para inactivos, blanco en hover
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span 
                        className={`text-2xl transition-transform duration-200 ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}
                    >
                        {emoji}
                    </span>
                    <span className="text-[10px] mt-0.5 font-semibold tracking-wide">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNavBar = () => {
    const { t } = useTranslation();

    // --- ESTRUCTURA DE NAVEGACIÓN CORREGIDA ---
    // Incluye el "Ranking" como fue solicitado, con el emoji y label definidos por usted.
    // El orden también sigue su estructura.
    const navItems = [
        { to: '/home', label: t('nav.home', 'Inicio'), emoji: '🏠' },
        { to: '/ranking', label: t('nav.ranking', 'Top'), emoji: '🏆' },
        { to: '/market', label: t('nav.market', 'Mercado'), emoji: '⛏️' }, // Apunta a la nueva ruta /market
        { to: '/team', label: t('nav.team', 'Equipo'), emoji: '👥' },
        { to: '/profile', label: t('nav.profile', 'Perfil'), emoji: '👤' },
    ];
    // --- FIN DE LA CORRECCIÓN ---

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 h-14 max-w-lg mx-auto bg-surface/70 backdrop-blur-xl border-t border-border"
            style={{ WebkitBackdropFilter: 'blur(24px)', backdropFilter: 'blur(24px)' }}
        >
            <div className="flex justify-around items-center h-full">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </div>
        </nav>
    );
};

export default BottomNavBar;