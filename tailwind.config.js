/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        phoneDrop: {
          "0%": { transform: "translateY(-600px) rotate(-15deg)" },
          "70%": { transform: "translateY(350px) rotate(6deg)" },
          "85%": { transform: "translateY(310px) rotate(-4deg)" },
          "100%": { transform: "translateY(350px) rotate(0deg)" }
        },

        repairmanEnter: {
    "0%": { opacity: "0", transform: "translate(-50%, -50%) scale(0) rotate(-180deg)" },
    "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1) rotate(0deg)" }
  }
      },

      animation: {
        "phone-drop": "phoneDrop 2.2s ease-out forwards",
        "repairman-enter": "repairmanEnter 1.2s ease-out forwards"      }
    },
  },
  plugins: [],
};
