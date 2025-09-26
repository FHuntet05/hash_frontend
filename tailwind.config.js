<<<<<<< HEAD
// RUTA: frontend/tailwind.config.js (v5.0 - NUEVA PALETA "OBSIDIAN BLUE")
=======
// RUTA: frontend/tailwind.config.js (v5.0 - TEMA "LUJO DORADO")

import colors from 'tailwindcss/colors';
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
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
=======
        
        // --- INICIO DE LA TRANSFORMACIÓN VISUAL: NUEVA PALETA "LUJO DORADO" ---
        // La paleta de tema claro ha sido completamente reemplazada.

        background: colors.gray[950],      // Un negro profundo y suave para el fondo principal.
        card: colors.gray[900],           // Un gris muy oscuro para tarjetas y elementos elevados.
        
        text: {
          primary: colors.gray[100],      // Texto principal casi blanco para un alto contraste.
          secondary: colors.gray[400],    // Texto secundario más sutil.
          tertiary: colors.gray[500],     // Texto terciario, para información menos importante.
        },
        
        accent: {
          // El 'azul' primario ahora es un dorado vibrante y elegante.
          primary: colors.amber[400],
          primary_hover: colors.amber[500],
          
          // El 'verde' secundario ahora es un dorado más claro.
          secondary: colors.amber[300],
          secondary_hover: colors.amber[400],

          // El 'naranja' terciario ahora es el dorado principal para consistencia.
          tertiary: colors.amber[400],
          tertiary_hover: colors.amber[500],
        },

        status: {
            success: colors.green[400],     // Se mantiene verde para una semántica universalmente reconocida.
            warning: colors.amber[500],     // El ámbar encaja perfectamente con el tema dorado.
            danger: colors.red[500],        // Se mantiene rojo para una semántica universal.
            danger_hover: colors.red[600]
        },

        border: colors.gray[800],           // Un borde oscuro y sutil para separar elementos.

        // --- FIN DE LA TRANSFORMACIÓN VISUAL ---


        // --- PALETA TEMA OSCURO (ADMIN) - SIN CAMBIOS ---
        // Esta sección se ha mantenido intacta para no alterar el panel de administración.
        dark: {
          primary: '#111827',
          secondary: '#1f2937',
          tertiary: '#374151',
        },
        'accent-start': '#3b82f6',
        'accent-end': '#14b8a6',
        // --- FIN PALETA ADMIN ---
      },
      
      boxShadow: {
        'subtle': '0 4px 12px 0 rgb(255 255 255 / 0.05)', // Sombra adaptada para un fondo oscuro
        'medium': '0 8px 30px rgb(0 0 0 / 0.2)',
>>>>>>> 6803624c75f3447cccf5ca336538f739109a7503
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