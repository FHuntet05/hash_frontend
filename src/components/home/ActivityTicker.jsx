// RUTA: frontend/src/components/home/ActivityTicker.jsx (NUEVO COMPONENTE)

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowUpOnSquare } from 'react-icons/hi2';

// Generador de datos simulados para el ticker
const generateMockWithdrawals = (count = 10) => {
    const mockData = [];
    const usernames = ['CryptoKing', 'USDTWhale', 'BillionaireClub', 'DiamondHand', 'SatoshiN', 'EtherLord', 'MoonBoy', 'ChainSurfer', 'NFTCollector'];
    for (let i = 0; i < count; i++) {
        const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
        // Rango de retiro solicitado: 0.1 a 500
        const randomAmount = (Math.random() * (500 - 0.1) + 0.1);
        mockData.push({
            id: `withdraw_${i}_${Date.now()}`,
            username: `${randomUsername.slice(0, 4)}***`,
            amount: randomAmount,
        });
    }
    return mockData;
};

const ActivityTicker = () => {
    const { t } = useTranslation();
    // Generamos una lista inicial de retiros simulados
    const initialWithdrawals = useMemo(() => generateMockWithdrawals(), []);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    useEffect(() => {
        // Creamos un intervalo para rotar el elemento visible cada 3.5 segundos
        const interval = setInterval(() => {
            setCurrentItemIndex(prevIndex => (prevIndex + 1) % initialWithdrawals.length);
        }, 3500);

        return () => clearInterval(interval); // Limpiamos el intervalo al desmontar el componente
    }, [initialWithdrawals.length]);

    const currentItem = initialWithdrawals[currentItemIndex];

    return (
        <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-subtle p-3 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentItem.id}
                    className="flex items-center gap-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className="p-2 bg-accent-primary/10 rounded-full">
                        <HiOutlineArrowUpOnSquare className="w-5 h-5 text-accent-primary" />
                    </div>
                    <p className="text-sm text-text-secondary flex-grow">
                        <span className="font-semibold text-text-primary">{currentItem.username}</span>
                        {' '}
                        {t('activityTicker.hasWithdrawn', 'ha retirado')}
                        {' '}
                        <span className="font-bold text-accent-primary">{currentItem.amount.toFixed(2)} USDT</span>
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ActivityTicker;