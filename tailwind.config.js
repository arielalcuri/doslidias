/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#7fc9c9',
                    DEFAULT: '#5fb1b1',
                    dark: '#4a8d8d',
                },
                secondary: {
                    DEFAULT: '#e67300',
                },
                accent: '#f39c12',
                surface: '#fdfaf6',
                text: {
                    light: '#94a3b8',
                    main: '#1e293b',
                    dark: '#0f172a',
                },
                border: '#e2e8f0',
            },
            fontFamily: {
                serif: ['Marcellus', 'serif'],
                sans: ['Outfit', 'sans-serif'],
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'premium': '0 20px 50px rgba(0,0,0,0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'card': '0 20px 60px -15px rgba(0, 0, 0, 0.03)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
