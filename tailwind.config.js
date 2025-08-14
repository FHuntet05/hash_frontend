// RUTA: frontend/tailwind.config.js (v4.0 - CON PALETA DARK MODE)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- PALETA TEMA CLARO (USUARIO) ---
        background: '#f8fafc', 
        card: '#ffffff',
        text: {
          primary: '#1e293b',
          secondary: '#475569',
          tertiary: '#94a3b8',
        },
        accent: {
          primary: '#0ea5e9',
          primary_hover: '#0284c7',
          secondary: '#84cc16',
          secondary_hover: '#65a30d',
          tertiary: '#f97316',
          tertiary_hover: '#ea580c',
        },
        status: {
            success: '#16a34a',
            warning: '#f59e0b',
            danger: '#dc2626',
            danger_hover: '#b91c1c'
        },
        border: '#e2e8f0',

        // --- INICIO: NUEVA PALETA TEMA OSCURO (ADMIN) ---
        dark: {
          primary: '#111827',   // gray-900 (Fondo principal más oscuro)
          secondary: '#1f2937', // gray-800 (Fondo de tarjetas y sidebar)
          tertiary: '#374151',  // gray-700 (Bordes, fondos de input)
        },
        // Acentos para el modo oscuro
        'accent-start': '#3b82f6', // blue-500
        'accent-end': '#14b8a6',   // teal-500
        // --- FIN: NUEVA PALETA TEMA OSCURO ---
      },
      
      boxShadow: {
        'subtle': '0 4px 12px 0 rgb(0 0 0 / 0.07)',
        'medium': '0 8px 30px rgb(0 0 0 / 0.12)',
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