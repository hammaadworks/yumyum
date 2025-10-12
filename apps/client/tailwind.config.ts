
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FEF3E2',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#FAB12F',
          strong: '#FA812F',
          foreground: '#0B0B0B'
        },
        secondary: {
          DEFAULT: '#0B0B0B',
          foreground: '#FEF3E2'
        },
        accent: '#FFC857',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DD0303',
        muted: '#9CA3AF',
        border: '#E6E6E6',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
