// --- START OF FILE tailwind.config.js ---

// RUTA: frontend/tailwind.config.js (v7.1 - PRUEBA DE FONDO ROJO)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- INICIO DE CAMBIO DRÁSTICO PARA PRUEBA ---
        // Se establece un rojo muy oscuro como fondo para verificar el cambio.
        background: '#450a0a', // Esto es equivalente a 'red-950' en Tailwind
        
        // El color 'surface' se mantiene oscuro para que los componentes resalten.
        surface: '#1A1C20',
        // --- FIN DE CAMBIO DRÁSTICO ---

        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        text: {
          primary: '#E6EDF3',
          secondary: '#8B949E',
          terciary: '#484F58',
        },
        border: '#30363D',
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          danger_hover: '#DC2626',
        },
      },
      boxShadow: {
        subtle: '0 4px 12px 0 rgb(0 0 0 / 0.1)',
        medium: '0 8px 30px rgb(0 0 0 / 0.15)',
      },
    },
  },
  plugins: [],
};

// --- END OF FILE tailwind.config.js ---