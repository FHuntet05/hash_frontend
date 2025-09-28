// RUTA: frontend/tailwind.config.js (v5.0 - NUEVA PALETA "OBSIDIAN BLUE")

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- INICIO: NUEVA PALETA DE COLORES UNIFICADA ---
        background: '#000000',      // Negro puro para el fondo principal.
        surface: '#101010',         // Un gris muy oscuro para tarjetas, modales y superficies elevadas.
        
        text: {
          primary: '#FFFFFF',      // Blanco puro para el texto principal y los títulos.
          secondary: '#A0A0A0',    // Un gris claro para texto secundario y descriptivo.
          terciary: '#505050',     // Un gris más oscuro para elementos de baja prioridad.
        },
        
        accent: {
          DEFAULT: '#3B82F6',       // Azul (blue-500) para botones principales y elementos activos.
          hover: '#2563EB',         // Un azul más oscuro (blue-600) para el estado hover.
        },

        status: {
            success: '#22C55E',     // Verde brillante (green-500) visible sobre negro.
            warning: '#F59E0B',     // Amarillo/ámbar brillante (amber-500).
            danger: '#EF4444',      // Rojo brillante (red-500).
            danger_hover: '#DC2626' // Rojo más oscuro (red-600) para hover.
        },

        border: '#2A2A2A',         // Color de borde sutil para separar elementos sobre el fondo.
        // --- FIN: NUEVA PALETA ---
      },
      
      boxShadow: {
        'subtle': '0 4px 12px 0 rgb(255 255 255 / 0.05)',
        'medium': '0 8px 30px rgb(255 255 255 / 0.1)',
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