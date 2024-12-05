import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        fadeUp: 'fadeUp 1s ease-out',
      },
      fontFamily: {
        pixel: 'var(--font-pixel)',
        arimo: 'var(--font-arimo)',
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        kingdom: "url('/kingdom scenery.png')",
        cave: "url('/cave_blue_theme.png')",
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(-30px)',
          },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({
        '.container': {
          '@apply max-w-[77.5rem] mx-auto p-5 md:px-10 lg:px-16 xl:max-w-[87.5rem]':
            {},
        },
        '.h1': {
          '@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]':
            {},
        },
        '.h2': {
          '@apply text-[16px] leading-[2.5rem]': {},
        },
        '.h3': {
          '@apply text-[2rem] leading-normal md:text-[2.5rem]': {},
        },
        '.h4': {
          '@apply text-[2rem] leading-normal': {},
        },
        '.h5': {
          '@apply text-2xl leading-normal': {},
        },
        '.h6': {
          '@apply font-semibold text-lg leading-8': {},
        },
        '.body-1': {
          '@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8':
            {},
        },
        '.body-2': {
          '@apply font-light text-[0.875rem] leading-6 md:text-base': {},
        },
        '.caption': {
          '@apply text-sm': {},
        },
        '.tagline': {
          '@apply font-grotesk font-light text-xs tracking-tagline uppercase':
            {},
        },
        '.quote': {
          '@apply font-code text-lg leading-normal': {},
        },
        '.button': {
          '@apply font-pixel text-xs font-bold uppercase tracking-wider': {},
        },
      });
      addUtilities({
        '.tap-highlight-color': {
          '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
        },
      });
    }),
  ],
};
