/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        background:  'hsl(210, 16%, 93%)',
        sidebar:     'hsl(210, 11%, 15%)',
        bgheader:    'hsl(197, 66%, 21%)',
        'bgheader-hover': 'hsl(197, 66%, 28%)',
        card:        'hsl(0, 0%, 100%)',
        primary:     'hsl(222.2, 47.4%, 11.2%)',
        border:      'hsl(214.3, 31.8%, 91.4%)',
        muted:       'hsl(210, 40%, 96.1%)',
        destructive: 'hsl(0, 84.2%, 60.2%)',
        bgtable:     'hsl(180, 1%, 75%)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}
