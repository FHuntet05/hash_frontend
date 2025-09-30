// --- START OF FILE tailwind.config.js ---

// RUTA: frontend/tailwind.config.js (v7.2 - TEMA AZUL MARINO DEFINITIVO)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- INICIO DE PALETA AZUL MARINO DEFINITIVA ---
        // Se establece el azul marino oscuro como color de fondo definitivo.
        background: '#0D1117',
        
        // El color 'surface' para las tarjetas será un azul ligeramente más claro para crear contraste.
        surface: '#161B22',
        // --- FIN DE PALETA AZUL MARINO ---

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