// RUTA: frontend/src/pages/DepositHistoryPage.jsx (v1.2 - DATOS AJUSTADOS)

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiOutlineArrowDownOnSquare } from 'react-icons/hi2';
import { FaCheckCircle } from 'react-icons/fa';

// --- INICIO DE LA MODIFICACIÓN DE DATOS ---
const generateMockDeposits = (count = 25) => {
  const mockData = [];
  const usernames = ['CryptoKing', 'USDTWhale', 'BillionaireClub', 'DiamondHand', 'SatoshiN', 'EtherLord', 'MoonBoy'];
  
  for (let i = 0; i < count; i++) {
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
    // Se ajusta el rango de 2 a 1500
    let randomAmount = Math.random() * (1500 - 2) + 2;

    // Aproximadamente el 30% de las veces, se redondea el número a la decena más cercana (termina en 0)
    if (Math.random() < 0.3) {
      randomAmount = Math.round(randomAmount / 10) * 10;
    }

    const randomDate = new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000);

    mockData.push({
      _id: `mock_${i}`,
      username: `${randomUsername.slice(0, 4)}***`,
      amount: randomAmount,
      date: randomDate,
    });
  }
  // Se ordena para que los más recientes aparezcan primero
  return mockData.sort((a, b) => b.date - a.date);
};
// --- FIN DE LA MODIFICACIÓN DE DATOS ---

const DepositItem = ({ username, amount, date }) => {
    const { t, i18n } = useTranslation();
    
    const timeAgo = useMemo(() => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return t('time.yearsAgo', { count: Math.floor(interval) });
        interval = seconds / 2592000;
        if (interval > 1) return t('time.monthsAgo', { count: Math.floor(interval) });
        interval = seconds / 86400;
        if (interval > 1) return t('time.daysAgo', { count: Math.floor(interval) });
        interval = seconds / 3600;
        if (interval > 1) return t('time.hoursAgo', { count: Math.floor(interval) });
        interval = seconds / 60;
        if (interval > 1) return t('time.minutesAgo', { count: Math.floor(interval) });
        return t('time.justNow', 'Justo ahora');
    }, [date, t, i18n.language]); 

    return (
        <motion.div 
            className="flex items-center p-4 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-subtle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="p-2 bg-status-success/10 rounded-full mr-4">
                <FaCheckCircle className="w-6 h-6 text-status-success" />
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-text-primary">
                    {t('depositHistory.userDeposited', { username })}
                </p>
                <p className="text-xs text-text-secondary">{timeAgo}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-status-success text-lg">+{amount.toFixed(2)}</p>
                <p className="text-xs text-text-secondary">USDT</p>
            </div>
        </motion.div>
    );
};


const DepositHistoryPage = () => {
  const { t } = useTranslation();
  const mockDeposits = useMemo(() => generateMockDeposits(), []);

  return (
    <motion.div 
        className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 pt-6 gap-6 pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary flex items-center justify-center gap-2">
            <HiOutlineArrowDownOnSquare className="text-accent-primary"/>
            {t('depositHistory.title')}
        </h1>
        <p className="text-text-secondary mt-1">
            {t('depositHistory.subtitle')}
        </p>
      </div>
      
      <div className="space-y-3">
        {mockDeposits.map((deposit) => (
            <DepositItem 
                key={deposit._id} 
                username={deposit.username}
                amount={deposit.amount}
                date={deposit.date}
            />
        ))}
      </div>
    </motion.div>
  );
};

export default DepositHistoryPage;