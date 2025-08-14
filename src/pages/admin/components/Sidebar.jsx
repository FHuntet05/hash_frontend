// RUTA: frontend/src/pages/admin/components/Sidebar.jsx (RUTAS CORREGIDAS Y ESTILO OSCURO)

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiOutlineHome, HiOutlineUsers, HiOutlineReceiptRefund, HiOutlineQuestionMarkCircle, 
  HiOutlineWrenchScrewdriver, HiOutlineCog6Tooth, HiOutlineBuildingLibrary, HiOutlineShieldCheck, 
  HiOutlineFunnel, HiOutlineMegaphone, HiOutlineCommandLine 
} from 'react-icons/hi2';

// --- RUTAS VERIFICADAS ---
const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HiOutlineHome },
  { name: 'Usuarios', href: '/admin/users', icon: HiOutlineUsers },
  { name: 'Transacciones', href: '/admin/transactions', icon: HiOutlineReceiptRefund }, // Verificado
  { name: 'Retiros', href: '/admin/withdrawals', icon: HiOutlineQuestionMarkCircle },
  { name: 'Tesorería', href: '/admin/treasury', icon: HiOutlineBuildingLibrary }, // Verificado
  { name: 'Dispensador Gas', href: '/admin/gas-dispenser', icon: HiOutlineFunnel },
  { name: 'Notificaciones', href: '/admin/notifications', icon: HiOutlineMegaphone },
  { name: 'Monitor Blockchain', href: '/admin/blockchain-monitor', icon: HiOutlineCommandLine },
  { name: 'Fábricas', href: '/admin/factories', icon: HiOutlineWrenchScrewdriver },
  { name: 'Seguridad', href: '/admin/security', icon: HiOutlineShieldCheck },
  { name: 'Ajustes', href: '/admin/settings', icon: HiOutlineCog6Tooth },
];

const Sidebar = ({ onLinkClick = () => {} }) => {
    // --- ESTILOS ADAPTADOS AL TEMA OSCURO ---
    const linkClasses = "flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-accent-start/10 hover:text-white transition-colors";
    const activeLinkClasses = "bg-accent-start/20 text-white font-bold";
  
    return (
      <aside className="w-64 bg-dark-secondary p-4 flex flex-col border-r border-white/10 h-full">
        <div className="text-center py-4 mb-4">
          <h1 className="text-2xl font-bold text-accent-start">MEGA FÁBRICA</h1>
          <p className="text-sm text-text-secondary">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={onLinkClick}
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <link.icon className="w-6 h-6" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    );
};

export default Sidebar;