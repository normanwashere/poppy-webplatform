/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-lavender': '#E6E0F8',
        'primary-mint': '#C1E1C1',
        'primary-lavender': '#D6C6E4',
        'action-pink': '#FFC0CB',
        'action-yellow': '#FDFD96',
        'action-red': '#FFB3B3',
        'text-dark': '#3D3D3D',
        'highlight-today': 'rgba(214, 198, 228, 0.5)',
      },
      boxShadow: {
        'clay-light': '-8px -8px 16px rgba(255, 255, 255, 0.7)',
        'clay-dark': '8px 8px 16px rgba(0, 0, 0, 0.15)',
        'clay-inset-light': 'inset -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'clay-inset-dark': 'inset 4px 4px 8px rgba(0, 0, 0, 0.15)',
        'clay-button-light': '-6px -6px 12px rgba(255, 255, 255, 0.7)',
        'clay-button-dark': '6px 6px 12px rgba(0, 0, 0, 0.15)',
        'clay-button-active-light': '-2px -2px 6px rgba(255, 255, 255, 0.7)',
        'clay-button-active-dark': '2px 2px 6px rgba(0, 0, 0, 0.15)',
        'fc-event-light': '-3px -3px 8px rgba(255, 255, 255, 0.7)',
        'fc-event-dark': '3px 3px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
