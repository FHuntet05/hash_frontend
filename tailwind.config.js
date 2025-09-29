// --- START OF FILE tailwind.config.js ---
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { background: { DEFAULT: '#121212', start: '#0D1117', end: '#121b2e' }, surface: '#1A1C20', text: { primary: '#E6EDF3', secondary: '#8B949E', terciary: '#484F58' }, accent: { DEFAULT: '#3B82F6', hover: '#2563EB' }, status: { success: '#22C55E', warning: '#F59E0B', danger: '#EF4444', danger_hover: '#DC2626' }, border: '#30363D' }, boxShadow: { 'subtle': '0 4px 12px 0 rgb(0 0 0 / 0.1)', 'medium': '0 8px 30px rgb(0 0 0 / 0.15)' } } },
  plugins: [],
};
// --- END OF FILE tailwind.config.js ---