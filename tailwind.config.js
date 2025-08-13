// RUTA: frontend/tailwind.config.js (VERSIÓN MEGA FÁBRICA - PALETA SEMÁNTICA)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- PALETA DE COLORES SEMÁNTICA "MEGA FÁBRICA" ---
        // Nombres basados en la función, no en el color.
        
        // Fondos
        background: '#0f172a', // Equivalente a slate-900
        card: {
          DEFAULT: '#1e293b', // Equivalente a slate-800
          hover: '#334155',  // Equivalente a slate-700
        },

        // Texto
        text: {
          primary: '#f8fafc',   // Equivalente a slate-50 (Blanco Hueso)
          secondary: '#94a3b8', // Equivalente a slate-400
          tertiary: '#64748b',  // Equivalente a slate-500
        },

        // Acentos de color
        accent: {
          primary: '#38bdf8',   // Equivalente a sky-400 (Azul Eléctrico)
          primary_hover: '#0ea5e9', // Equivalente a sky-500
          secondary: '#a3e635', // Equivalente a lime-400 (Verde Neón)
          secondary_hover: '#84cc16', // Equivalente a lime-500
        },
        
        // Colores de Estado
        status: {
            success: '#22c55e', // green-500
            warning: '#facc15', // yellow-400
            danger: '#ef4444',  // red-500
            danger_hover: '#dc2626' // red-600
        },

        // Bordes y Divisores
        border: '#334155',     // Equivalente a slate-700
      },
      
      // Se eliminan las 'backgroundImage' obsoletas.
      // Si se necesitan gradientes, se pueden definir aquí.
      // Ejemplo: 'primary-gradient': 'linear-gradient(to right, #38bdf8, #a3e635)',
      
      boxShadow: {
        // Sombra para botones y elementos interactivos, usando los nuevos acentos.
        'accent-glow': '0 0 15px 5px rgba(56, 189, 248, 0.3)', // Sombra azul (accent-primary)
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};