// RUTA: frontend/src/components/layout/BottomNavBar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Importamos iconos profesionales de HeroIcons v2
import { 
  HiHome, 
  HiCpuChip,    // Para "Potenciadores/Mercado"
  HiUsers,      // Para "Equipo"
  HiUser,       // Para "Perfil"
  HiClipboardDocumentList // Para "Tareas"
} from 'react-icons/hi2';

const NavItem = ({ to, label, icon: Icon }) => {
    return (
        <NavLink 
            to={to} 
            end={to === '/home'} 
            className={({ isActive }) => `
                flex flex-col items-center justify-center flex-1 h-full pt-2 pb-1 
                transition-all duration-200 ease-in-out 
                ${isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}
            `}
        >
            {({ isActive }) => (
                <>
                    <div className={`relative p-1 transition-transform duration-200 ${isActive ? '-translate-y-1' : ''}`}>
                        <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : ''}`} />
                        {isActive && (
                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                        )}
                    </div>
                    <span className="text-[10px] font-medium tracking-wide mt-0.5">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNavBar = () => {
    const { t } = useTranslation();

    const navItems = [
        { to: '/home', label: 'Inicio', icon: HiHome },
        { to: '/ranking', label: 'Tareas', icon: HiClipboardDocumentList }, // Tareas ahora con icono de lista
        { to: '/market', label: 'Potencia', icon: HiCpuChip }, // Mercado ahora es "Potencia"
        { to: '/team', label: 'Equipo', icon: HiUsers },
        { to: '/profile', label: 'Perfil', icon: HiUser },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 max-w-lg mx-auto bg-surface/90 backdrop-blur-xl border-t border-border z-40">
            <div className="flex justify-around items-center h-full px-2">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </div>
        </nav>
    );
};

export default BottomNavBar;