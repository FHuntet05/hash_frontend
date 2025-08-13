// RUTA: frontend/src/components/common/Modal.jsx (PLANTILLA CRISTALINA REUTILIZABLE)

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="relative bg-card/80 backdrop-blur-lg rounded-2xl w-full max-w-lg text-text-primary border border-white/20 shadow-medium flex flex-col max-h-[90vh]"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-border">
                            <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-text-tertiary hover:text-text-primary hover:bg-black/10 transition-colors">
                                <HiXMark className="w-6 h-6" />
                            </button>
                        </header>
                        <main className="flex-grow p-4 overflow-y-auto no-scrollbar">
                            {children}
                        </main>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;