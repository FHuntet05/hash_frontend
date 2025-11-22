// RUTA: frontend/tailwind.config.js

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'], // Para los contadores numéricos
      },
      colors: {
        // --- PALETA NOVMINING (Industrial Dark) ---
        background: '#111827', // Gray 900 - Fondo principal
        surface: '#1F2937',    // Gray 800 - Tarjetas y Paneles
        
        // Acento Naranja (Potencia/Energía)
        accent: {
          DEFAULT: '#F97316', // Orange 500
          hover: '#EA580C',   // Orange 600
          light: '#FDBA74',   // Orange 300 (para brillos)
        },
        
        // Textos
        text: {
          primary: '#F3F4F6',   // Gray 100
          secondary: '#9CA3AF', // Gray 400
          muted: '#4B5563',     // Gray 600
        },
        
        border: '#374151', // Gray 700
        
        // Estados
        status: {
          success: '#10B981', // Emerald 500
          warning: '#F59E0B', // Amber 500
          danger: '#EF4444',  // Red 500
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(249, 115, 22, 0.3)', // Brillo naranja para potenciadores
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};