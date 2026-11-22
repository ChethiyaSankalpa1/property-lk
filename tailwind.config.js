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
        },
        /* --- Anime accent palette (layered on top of the premium brand colours) --- */
        sakura: {
          200: '#FFD9EA',
          300: '#FFB7D5',
          400: '#FF8FC0',
          500: '#FF6BAA',
          600: '#E84C8B',
        },
        neon: {
          200: '#B8FBFD',
          300: '#7DF9FF',
          400: '#3DE8F0',
          500: '#16D3DE',
          600: '#0FA9B4',
        },
        violet: {
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        sunset: {
          200: '#FEEBC8',
          300: '#FDD9A0',
          400: '#FBBF6B',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        display: ['Cinzel', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sinhala: ['Noto Sans Sinhala', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.35)',
        'glow-navy': '0 0 35px -5px rgba(10, 17, 40, 0.45)',
        'glow-sakura': '0 0 34px -6px rgba(255, 107, 170, 0.45)',
        'glow-neon': '0 0 34px -6px rgba(61, 232, 240, 0.45)',
        'glow-violet': '0 0 34px -6px rgba(167, 139, 250, 0.45)',
        'glow-sunset': '0 0 34px -6px rgba(251, 191, 107, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'card-luxury': '0 10px 40px -10px rgba(10, 17, 40, 0.08), 0 2px 8px -2px rgba(10, 17, 40, 0.04)',
        'card-luxury-hover': '0 20px 45px -12px rgba(16, 185, 129, 0.18), 0 8px 24px -4px rgba(10, 17, 40, 0.12)',
      },
      backgroundImage: {
        'luxury-mesh': 'radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(10, 17, 40, 0.25) 0px, transparent 50%)',
        'navy-gradient': 'linear-gradient(135deg, #0A1128 0%, #0F1838 50%, #060B18 100%)',
        'anime-aurora': 'radial-gradient(at 12% 18%, rgba(255, 107, 170, 0.20) 0px, transparent 45%), radial-gradient(at 88% 12%, rgba(61, 232, 240, 0.20) 0px, transparent 45%), radial-gradient(at 78% 82%, rgba(167, 139, 250, 0.20) 0px, transparent 45%), radial-gradient(at 20% 88%, rgba(251, 191, 107, 0.18) 0px, transparent 45%)',
        'anime-sheen': 'linear-gradient(110deg, transparent 22%, rgba(255, 255, 255, 0.55) 50%, transparent 78%)',
        'anime-rainbow': 'linear-gradient(90deg, #FF6BAA 0%, #A78BFA 25%, #3DE8F0 50%, #34D399 75%, #FBBF6B 100%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatySlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        auroraShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmerSweep: {
          '0%': { transform: 'translateX(-130%)' },
          '100%': { transform: 'translateX(130%)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        ringPulse: {
          '0%': { transform: 'scale(0.85)', opacity: '0.65' },
          '70%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        bobble: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(320%)' },
        },
        borderFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        'floaty-slow': 'floatySlow 9s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3.2s ease-in-out infinite',
        aurora: 'auroraShift 18s ease-in-out infinite',
        'gradient-x': 'gradientX 7s ease infinite',
        shimmer: 'shimmerSweep 2.4s linear infinite',
        twinkle: 'twinkle 3.2s ease-in-out infinite',
        'ring-pulse': 'ringPulse 2.6s cubic-bezier(0.24, 0.6, 0.35, 1) infinite',
        bobble: 'bobble 4.5s ease-in-out infinite',
        scanline: 'scanline 4.5s linear infinite',
        'border-flow': 'borderFlow 5s ease infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 16s linear infinite',
      },
      transitionTimingFunction: {
        anime: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
