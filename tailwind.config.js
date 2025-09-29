// --- START OF FILE tailwind.config.js ---

// RUTA: frontend/tailwind.config.js (v7.0 - SOLUCIÓN DE FONDO SÓLIDO DEFINITIVA)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- INICIO DE MODIFICACIÓN CRÍTICA ---
        // Se define un único color de fondo sólido, elegante y oscuro.
        background: '#1A1C20',
        
        // El color 'surface' se mantiene igual o similar para las tarjetas.
        surface: '#1A1C20',
        // --- FIN DE MODIFICACIÓN CRÍTICA ---

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