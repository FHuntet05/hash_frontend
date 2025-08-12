// RUTA: frontend/src/pages/admin/components/MobileDrawer.jsx (NUEVO)

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Sidebar from './Sidebar'; // Reutilizamos el Sidebar existente

const MobileDrawer = ({ isOpen, setIsOpen }) => {
  const closeDrawer = () => setIsOpen(false);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40 md:hidden" onClose={setIsOpen}>
        {/* Fondo oscuro translúcido */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          {/* Panel del Drawer */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              {/* Aquí insertamos el contenido de nuestro Sidebar, pasándole la función para cerrarse */}
              <Sidebar onLinkClick={closeDrawer} />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileDrawer;