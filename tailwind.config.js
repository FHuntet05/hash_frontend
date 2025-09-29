// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0F1A',       // Azul oscuro base
          start: '#0B0F1A',         // Parte superior del degradado
          mid: '#0F172A',           // Punto medio más profundo
          end: '#1E293B',           // Parte inferior más clara
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        text: {
          primary: '#E6EDF3',
          secondary: '#8B949E',
          terciary: '#484F58',
        },
        surface: '#1A1C20',
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
