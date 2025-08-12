// RUTA: src/components/layout/BottomNavBar.jsx (VERSIÓN MEGA FÁBRICA - SINCRONIZADA)
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiHome, HiChartBar, HiWrenchScrewdriver, HiUsers, HiUser } from 'react-icons/hi2';
import { motion } from 'framer-motion';

// NOTA: Se eliminan las importaciones de stores de Zustand que no se utilizan directamente aquí
// para mantener el componente más limpio.
// import useTeamStore from '../../store/teamStore';
// import useToolsStore from '../../store/toolsStore';

const navItems = [
  { to: '/home', labelKey: 'nav.home', Icon: HiHome }, // MODIFICADO: Apunta a /home en lugar de /
  { to: '/ranking', labelKey: 'nav.ranking', Icon: HiChartBar },
  // MODIFICACIÓN CRÍTICA: La ruta ahora es '/factories' y la etiqueta 'nav.factories'
  { to: '/factories', labelKey: 'nav.factories', Icon: HiWrenchScrewdriver },
  { to: '/team', labelKey: 'nav.team', Icon: HiUsers },
  { to: '/profile', labelKey: 'nav.profile', Icon: HiUser },
];

const NavItem = ({ to, labelKey, Icon, isRoot, prefetch }) => {
  const { t } = useTranslation();

  const handleMouseEnter = () => {
    if (prefetch) {
      prefetch();
    }
  };

  return (
    <NavLink
      to={to}
      end={isRoot}
      onMouseEnter={handleMouseEnter}
      className="flex-1 flex flex-col items-center justify-center text-xs h-full relative group"
    >
      {({ isActive }) => {
        const IconComponent = Icon;
        
        return (
          <div className="flex flex-col items-center justify-center w-full h-full pt-1">
            <div className="relative mb-1">
              <motion.div 
                className="relative"
                animate={{ y: isActive ? -4 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <IconComponent
                  className={`w-7 h-7 transition-colors duration-300 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}
                />
              </motion.div>
            </div>
            <span
              className={`text-xs transition-colors duration-300 ${isActive ? 'font-bold text-white' : 'text-text-secondary group-hover:text-white'}`}
            >
              {t(labelKey)}
            </span>
          </div>
        );
      }}
    </NavLink>
  );
};

const BottomNavBar = () => {
  return (
    // El nav sigue siendo transparente. El estilo del contenedor se gestiona en Layout.jsx.
    <nav className="w-full h-20 flex justify-around items-center">
      {navItems.map((item, index) => (
        <NavItem 
            key={index} 
            to={item.to} 
            labelKey={item.labelKey} 
            Icon={item.Icon} 
            isRoot={item.to === '/home'} // MODIFICADO: La raíz ahora es /home
            prefetch={item.prefetch}
        />
      ))}
    </nav>
  );
};

export default BottomNavBar;