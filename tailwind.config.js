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
        DarkBlue: "#F86F03", // Buttons Hover
        gradientTo: "#5D26B7", //  Buttons
        gradpurple: "#000000", // Sidebar Gradiant
        gradientFrom: "#8343E8", // Sidebar Gradiant
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
