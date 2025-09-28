// RUTA: frontend/tailwind.config.js (v5.1 - AJUSTE DE PALETA "SOFT OBSIDIAN")

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- INICIO: PALETA DE COLORES AJUSTADA ---
        // CAMBIO: El fondo ahora es un gris muy oscuro, no negro puro.
        background: '#121212',
        // CAMBIO: La superficie se aclara ligeramente para mantener el contraste.
        surface: '#1A1A1A',
        
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          terciary: '#505050',
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

        border: '#2A2A2A',
        // --- FIN: PALETA ---
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