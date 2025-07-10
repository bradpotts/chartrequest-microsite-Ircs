/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // Tailwind CSS v4 design tokens approach
    tokens: {
      colors: {
        // Primary and accent colors
        primary: '#144CEB',
        
        // Background colors
        'bg': {
          blue: '#F5F7FE',
          white: '#FFFFFF',
          green: '#DCFCE7',
          'blue-dark': '#E5E9FC', // Slightly darker than bg-blue
          'white-dark': '#F7F7F7', // Off-white for contrast
          'green-dark': '#CAECDB', // Slightly darker than bg-green
        },
        
        // Border colors
        'border': {
          blue: '#D0D7F7',
          white: '#EFEFEF',
          green: '#BFE9D0',
        },
        
        // Icon background colors
        'icon': {
          blue: '#5E59FF',
          purple: '#AA41FF',
          'blue-light': '#144CEB', // Same as primary
          green: '#00C54E',
          red: '#F74F00',
        },
        
        // Modern UI color palette
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
    // For backward compatibility with utility classes
    extend: {
      // For backward compatibility with custom utility classes
      colors: {
        primary: 'var(--colors-primary)',
        'bg-blue': 'var(--colors-bg-blue)',
        'bg-white': 'var(--colors-bg-white)',
        'bg-green': 'var(--colors-bg-green)',
        'bg-blue-dark': 'var(--colors-bg-blue-dark)',
        'bg-white-dark': 'var(--colors-bg-white-dark)',
        'bg-green-dark': 'var(--colors-bg-green-dark)',
        'border-blue': 'var(--colors-border-blue)',
        'border-white': 'var(--colors-border-white)',
        'border-green': 'var(--colors-border-green)',
        'icon-bg-blue': 'var(--colors-icon-blue)',
        'icon-bg-purple': 'var(--colors-icon-purple)',
        'icon-bg-blue-light': 'var(--colors-icon-blue-light)',
        'icon-bg-green': 'var(--colors-icon-green)',
        'icon-bg-red': 'var(--colors-icon-red)',
        'ui-gray-50': 'var(--colors-gray-50)',
        'ui-gray-100': 'var(--colors-gray-100)',
        'ui-gray-200': 'var(--colors-gray-200)',
        'ui-gray-300': 'var(--colors-gray-300)',
        'ui-gray-400': 'var(--colors-gray-400)',
        'ui-gray-500': 'var(--colors-gray-500)',
        'ui-gray-600': 'var(--colors-gray-600)',
        'ui-gray-700': 'var(--colors-gray-700)',
        'ui-gray-800': 'var(--colors-gray-800)',
        'ui-gray-900': 'var(--colors-gray-900)',
      },
    },
  },
  // Tailwind CSS v4 specific features
  future: {
    // Enable modern features
    hoverOnlyWhenSupported: true,
  },
  // Font settings using the new tokens approach
  fonts: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  // Shadow tokens
  shadows: {
    'modern-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    'modern-md': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
    'modern-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  },
  // Radius tokens
  radii: {
    'modern-sm': '0.375rem',
    'modern': '0.5rem',
    'modern-md': '0.75rem',
    'modern-lg': '1rem',
    'modern-xl': '1.5rem',
  },
  // Animation tokens
  animations: {
    'smooth-fade': {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    'slide-up': {
      from: { transform: 'translateY(10px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
  },
  plugins: [],
}
