/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B18',
          900: '#0A1128',
          850: '#0F1838',
          800: '#142149',
          700: '#1E3066',
          600: '#2A438C',
          500: '#3D5EB5',
        },
        emerald: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        gold: {
          DEFAULT: '#D4AF37',
          400: '#F59E0B',
          500: '#D4AF37',
          600: '#B8860B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.35)',
        'glow-navy': '0 0 35px -5px rgba(10, 17, 40, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'card-luxury': '0 10px 40px -10px rgba(10, 17, 40, 0.08), 0 2px 8px -2px rgba(10, 17, 40, 0.04)',
        'card-luxury-hover': '0 20px 45px -12px rgba(16, 185, 129, 0.18), 0 8px 24px -4px rgba(10, 17, 40, 0.12)',
      },
      backgroundImage: {
        'luxury-mesh': 'radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(10, 17, 40, 0.25) 0px, transparent 50%)',
        'navy-gradient': 'linear-gradient(135deg, #0A1128 0%, #0F1838 50%, #060B18 100%)',
      }
    },
  },
  plugins: [],
}
