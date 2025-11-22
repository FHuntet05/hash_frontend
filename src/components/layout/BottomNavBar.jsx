import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiHome, 
  HiCpuChip,
  HiUsers,
  HiUser,
  HiClipboardDocumentList 
} from 'react-icons/hi2';

const NavItem = ({ to, label, icon: Icon }) => {
    return (
        <NavLink 
            to={to} 
            end={to === '/home'} 
            className={({ isActive }) => `
                relative flex flex-col items-center justify-center flex-1 h-full pt-2 pb-1 
                transition-all duration-300 ease-out group
            `}
        >
            {({ isActive }) => (
                <>
                    {/* Fondo "Duotone" que aparece al activar */}
                    <div className={`
                        absolute top-2 w-10 h-8 rounded-xl transition-all duration-300
                        ${isActive ? 'bg-accent/20 scale-100' : 'bg-transparent scale-50'}
                    `}></div>

                    <div className={`relative z-10 transition-transform duration-200 ${isActive ? '-translate-y-1' : ''}`}>
                        <Icon className={`
                            w-6 h-6 transition-colors duration-300
                            ${isActive ? 'text-accent drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]' : 'text-text-secondary group-hover:text-text-primary'}
                        `} />
                    </div>
                    
                    <span className={`
                        text-[10px] font-bold tracking-wide mt-1 transition-colors duration-300
                        ${isActive ? 'text-accent' : 'text-text-secondary'}
                    `}>
                        {label}
                    </span>
                </>
            )}
        </NavLink>
    );
};

const BottomNavBar = () => {
    const navItems = [
        { to: '/home', label: 'Inicio', icon: HiHome },
        { to: '/ranking', label: 'Tareas', icon: HiClipboardDocumentList },
        { to: '/market', label: 'Potencia', icon: HiCpuChip },
        { to: '/team', label: 'Equipo', icon: HiUsers },
        { to: '/profile', label: 'Perfil', icon: HiUser },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 max-w-lg mx-auto bg-[#111827]/95 backdrop-blur-2xl border-t border-white/5 z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
            <div className="flex justify-around items-center h-full px-2 pb-2">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </div>
        </nav>
    );
};

export default BottomNavBar;