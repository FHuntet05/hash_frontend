// RUTA: frontend/tailwind.config.js (VERSIÓN FINAL v3.1 - FONDO BLANCO HUESO)

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- PALETA SEMÁNTICA "CRISTALINO Y ENERGÉTICO" ---
        // Fondos
        background: '#f8fafc', // slate-50 (Blanco Hueso, según su última directiva)
        card: '#ffffff',       // Blanco puro (para usar con transparencia, ej: bg-card/70)

        // Texto
        text: {
          primary: '#1e293b',   // slate-800
          secondary: '#475569', // slate-600
          tertiary: '#94a3b8',  // slate-400
        },

        // Acentos (Azul, Verde, Naranja)
        accent: {
          primary: '#0ea5e9',         // sky-500 (Azul)
          primary_hover: '#0284c7',   // sky-600
          secondary: '#84cc16',       // lime-500 (Verde)
          secondary_hover: '#65a30d', // lime-600
          tertiary: '#f97316',        // orange-500 (Naranja)
          tertiary_hover: '#ea580c',  // orange-600
        },
        
        status: {
            success: '#16a34a',
            warning: '#f59e0b',
            danger: '#dc2626',
            danger_hover: '#b91c1c'
        },

        border: '#e2e8f0', // slate-200
      },
      
      boxShadow: {
        'subtle': '0 4px 12px 0 rgb(0 0 0 / 0.07)',
        'medium': '0 8px 30px rgb(0 0 0 / 0.12)',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};