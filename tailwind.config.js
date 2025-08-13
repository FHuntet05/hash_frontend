// RUTA: frontend/tailwind.config.js (VERSIÓN FINAL - TEMA CLARO "FÁBRICA DIURNA")

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // --- NUEVA PALETA SEMÁNTICA PARA TEMA CLARO ---
      colors: {
        // Fondos
        background: '#f1f5f9', // Equivalente a slate-100 (Gris muy claro)
        card: {
          DEFAULT: '#ffffff', // Blanco puro
          hover: '#f8fafc',  // Equivalente a slate-50 (Blanco hueso para hover)
        },

        // Texto
        text: {
          primary: '#1e293b',   // Equivalente a slate-800 (Texto oscuro principal)
          secondary: '#64748b', // Equivalente a slate-500
          tertiary: '#94a3b8',  // Equivalente a slate-400
        },

        // Acentos de color (Estos se mantienen, pero ahora sobre fondo claro)
        accent: {
          primary: '#0ea5e9',   // Equivalente a sky-500 (Un azul ligeramente más oscuro para mejor contraste)
          primary_hover: '#0284c7', // Equivalente a sky-600
          secondary: '#84cc16', // Equivalente a lime-500 (Verde ligeramente más oscuro)
          secondary_hover: '#65a30d', // Equivalente a lime-600
        },
        
        // Colores de Estado (Se mantienen)
        status: {
            success: '#16a34a', // green-600
            warning: '#f59e0b', // amber-500
            danger: '#dc2626',  // red-600
            danger_hover: '#b91c1c' // red-700
        },

        // Bordes y Divisores
        border: '#e2e8f0',     // Equivalente a slate-200 (Borde sutil)
      },
      
      // La sección 'backgroundImage' se elimina. Ya no la usaremos.
      
      boxShadow: {
        // Sombra más sutil para el tema claro
        'subtle': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};