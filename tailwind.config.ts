import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          500: "#ef4444",
          600: "#dc2626",
        },
        primary: {
          400: "#ff6b6b",
          500: "#ff5252",
          600: "#ff3838",
        },
      },
      backgroundImage: {
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'morph': 'morph 6s ease-in-out infinite',
        'rotate-3d': 'rotate3d 6s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'particle': 'particle 3s ease-in-out infinite',
        'shine': 'shine 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale': 'scale 0.3s ease-in-out',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        rotate3d: {
          '0%': { transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)' },
          '25%': { transform: 'perspective(1000px) rotateY(90deg) rotateX(5deg) scale(0.95)' },
          '50%': { transform: 'perspective(1000px) rotateY(180deg) rotateX(10deg) scale(1)' },
          '75%': { transform: 'perspective(1000px) rotateY(270deg) rotateX(5deg) scale(0.95)' },
          '100%': { transform: 'perspective(1000px) rotateY(360deg) rotateX(0deg) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1) blur(0px)' },
          '50%': { filter: 'brightness(1.2) blur(2px)' },
        },
        particle: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0' },
          '50%': { transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translate(calc(var(--tw-translate-x) * 2), calc(var(--tw-translate-y) * 2)) scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
