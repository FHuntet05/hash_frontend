// --- START OF FILE BottomNavBar.jsx ---

// RUTA: frontend/src/components/layout/BottomNavBar.jsx (v2.2 - TAREAS REEMPLAZA A RANKING)

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavItem = ({ to, label, emoji }) => {
    return (
        <NavLink to={to} end={to === '/home'} className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full pt-1 transition-all duration-200 ease-in-out transform ${isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
            {({ isActive }) => (
                <>
                    <span className={`text-2xl transition-transform duration-200 ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}>{emoji}</span>
                    <span className="text-[10px] mt-0.5 font-semibold tracking-wide">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNavBar = () => {
    const { t } = useTranslation();

    const navItems = [
        { to: '/home', label: t('nav.home', 'Inicio'), emoji: '🏣' },
        // --- INICIO DE MODIFICACIÓN CRÍTICA ---
        // El enlace de Ranking ahora apunta a la misma ruta (/ranking) pero con una nueva etiqueta y emoji.
        { to: '/ranking', label: t('nav.tasks', 'Tareas'), emoji: '📱' },
        // --- FIN DE MODIFICACIÓN CRÍTICA ---
        { to: '/market', label: t('nav.market', 'Mercado'), emoji: '🌐' },
        { to: '/team', label: t('nav.team', 'Equipo'), emoji: '🧑‍🎓' },
        { to: '/profile', label: t('nav.profile', 'Perfil'), emoji: '🎁' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-14 max-w-lg mx-auto bg-surface/70 backdrop-blur-xl border-t border-border" style={{ WebkitBackdropFilter: 'blur(24px)', backdropFilter: 'blur(24px)' }}>
            <div className="flex justify-around items-center h-full">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </div>
        </nav>
    );
};

export default BottomNavBar;

// --- END OF FILE BottomNavBar.jsx ---