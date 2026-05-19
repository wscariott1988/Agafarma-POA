/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main.js",
  ],
  theme: {
    extend: {
      colors: {
        agafarma: {
          blue: '#00549A', // Cor principal azul
          yellow: '#FDB913', // Amarelo característico
          red: '#E3000F', // Vermelho para destaques
          light: '#F4F7F6', // Fundo claro
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
