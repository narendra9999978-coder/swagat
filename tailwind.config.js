/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B2545',
          navyLight: '#134074',
          navyDark: '#07182C',
          saffron: '#E05A10',
          saffronLight: '#FFF5EB',
          saffronBorder: '#FDBA74',
          green: '#057A55',
          greenLight: '#F0FDF4',
          greenBorder: '#86EFAC',
          gold: '#D97706',
          slateBg: '#F8FAFC',
          cardBg: '#FFFFFF',
          border: '#E2E8F0',
          textMuted: '#64748B',
          textDark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gov-sm': '0 1px 3px 0 rgba(11, 37, 69, 0.06), 0 1px 2px -1px rgba(11, 37, 69, 0.06)',
        'gov-md': '0 4px 6px -1px rgba(11, 37, 69, 0.07), 0 2px 4px -2px rgba(11, 37, 69, 0.05)',
        'gov-lg': '0 10px 15px -3px rgba(11, 37, 69, 0.08), 0 4px 6px -4px rgba(11, 37, 69, 0.04)',
        'gov-xl': '0 20px 25px -5px rgba(11, 37, 69, 0.1), 0 8px 10px -6px rgba(11, 37, 69, 0.05)',
        'gov-glow': '0 0 25px -5px rgba(224, 90, 16, 0.25)',
        'gov-blue-glow': '0 0 30px -5px rgba(19, 64, 116, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
