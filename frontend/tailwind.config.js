/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0e1a',
          secondary: '#0f1629',
          tertiary: '#162035',
        },
        border: {
          DEFAULT: '#1e2d4a',
          light: '#243450',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#60a5fa',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'ticker-scroll': 'ticker-scroll 30s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'ticker-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-auth': 'linear-gradient(135deg, #0a0e1a 0%, #0f1f3d 50%, #0a1628 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'panel': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
