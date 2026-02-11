/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "scoop-pink": "#FF69B4",
        "scoop-blue": "#40E0D0",
        "scoop-yellow": "#FFD700",
        "scoop-purple": "#9370DB",
        "scoop-bg": "#FFFDD0",

        // tons utilitários
        "scoop-soft-pink": "#FFE4F0",
        "scoop-soft-blue": "#E6FAF8",
      },

      fontFamily: {
        bubble: ['"Fredoka"', "sans-serif"],
        hand: ['"Patrick Hand"', "cursive"],
      },

      borderRadius: {
        scoop: "1.25rem",
      },

      boxShadow: {
        scoop: "0 10px 25px rgba(255,105,180,.25)",
        soft: "0 4px 10px rgba(0,0,0,.05)",
      },

      animation: {
        "fade-in": "fadeIn .25s ease-out",
        "scale-in": "scaleIn .25s ease-out",
        shake: "shake .4s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },

        scaleIn: {
          "0%": { transform: "scale(.92)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },

        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
