// --- START OF FILE tailwind.config.js ---

// RUTA: frontend/tailwind.config.js (v6.0 - "QUANTUM LEAP": PALETA COSMIC BLUE)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- INICIO: NUEVA PALETA DE COLORES ---
        // Se definen los colores base para el degradado y los componentes.
        background: {
          start: '#0D1117', // Un azul muy oscuro, casi negro, para la parte superior
          end: '#121b2e',   // Un azul cósmico profundo para la parte inferior
        },
        surface: '#1A1C20', // Un gris cósmico para las tarjetas, como en la referencia
        
        text: {
          primary: '#E6EDF3', // Un blanco ligeramente más suave
          secondary: '#8B949E',
          terciary: '#484F58',
        },
        
        // El azul del botón de la referencia es brillante y llamativo
        accent: {
          DEFAULT: '#3B82F6', // azul-500
          hover: '#2563EB',   // azul-600
        },

        status: {
            success: '#22C55E', // verde-500
            warning: '#F59E0B', // ambar-500
            danger: '#EF4444', // rojo-500
            danger_hover: '#DC2626' // rojo-600
        },

        border: '#30363D',
        // --- FIN: NUEVA PALETA ---
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