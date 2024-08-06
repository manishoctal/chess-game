/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "575px",
      md: "768px",
      lg: "991px",
      xl: "1199px",
      "2xl": "1330px",
    },
    extend: {
      colors: {
        DarkBlue: "#0081db", // Buttons Hover
        gradientTo: "#0096ff", //  Buttons
        gradpurple: "#ffffff", // Sidebar Gradiant
        gradientFrom: "#ffffff", // Sidebar Gradiant
        sideBarNavColor: "#000000",
        sideBarNavActiveColor: "#ffffff",
      },

      backgroundImage: {
        calendar: "url('../public/images/calendar.png')",
        calendarDark: "url('../public/images/calander-dark-mode.png')",
      },
      filterImage: {
        filter: "brightness(0) invert(1)",
      },
      // filter: {
      //   "brightness-0": "brightness(0) invert(1)",
      // },
      ButtonShadow: {
        shadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
      },
    },
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
      square: "square",
      alpha: "lower-alpha",
    },
    variants: {
      extend: {
        display: ["group-focus"],
      },
    },
  },
  plugins: [],
};
