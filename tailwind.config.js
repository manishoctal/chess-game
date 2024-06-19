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
        DarkBlue: "#631bd1", // Buttons Hover
        gradientTo: "#4a24c2", //  Buttons
        gradpurple: "#4a24c2", // Sidebar Gradiant
        gradientFrom: "#000", // Sidebar Gradiant
        sideBarNavColor: "#ffffff",
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
