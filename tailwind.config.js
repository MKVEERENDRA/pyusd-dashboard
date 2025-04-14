/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyberpunk NFT-inspired color palette
        'cyber-black': '#0D0D0F',
        'cyber-blue': '#00F0FF',
        'cyber-purple': '#9D00FF',
        'cyber-pink': '#FF00E5',
        'cyber-green': '#00FF9D',
        'cyber-yellow': '#FFE600',
        'cyber-orange': '#FF9D00',
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0D0D0F 0%, #1A1A2E 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(157, 0, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 229, 0.5)',
      },
      fontFamily: {
        'cyber': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
