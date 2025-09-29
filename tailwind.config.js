// --- START OF FILE tailwind.config.js ---

// RUTA: frontend/tailwind.config.js (v6.1 - CORRECCIÓN DE CLASE DE FONDO)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- INICIO: CORRECCIÓN CRÍTICA ---
        // Se añade una clave 'DEFAULT' para que la clase 'bg-background' sea válida.
        // Se mantiene la estructura 'start' y 'end' para el degradado del body.
        background: {
          DEFAULT: '#121212', // Un gris oscuro como color de fondo base para elementos
          start: '#0D1117',   // Azul muy oscuro para el inicio del degradado del body
          end: '#121b2e',     // Azul cósmico profundo para el final del degradado del body
        },
        // --- FIN: CORRECCIÓN CRÍTICA ---

        surface: '#1A1C20',
        
        text: {
          primary: '#E6EDF3',
          secondary: '#8B949E',
          terciary: '#484F58',
        },
        
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },

        status: {
            success: '#22C55E',
            warning: '#F59E0B',
            danger: '#EF4444',
            danger_hover: '#DC2626'
        },

        border: '#30363D',
      },
      
      boxShadow: {
        'subtle': '0 4px 12px 0 rgb(0 0 0 / 0.1)',
        'medium': '0 8px 30px rgb(0 0 0 / 0.15)',
      },

      keyframes: {
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite', 
      }
    },
  },
  plugins: [],
};

// --- END OF FILE tailwind.config.js ---