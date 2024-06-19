module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#FF007F",
      },
    },
    screens: {
      xxs: "320px",
      xs: "360px",
      sm: "480px",
      xmd: "640px",
      md: "768px",
      mdm: "900px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1536px",
    },
  },

  purge: ["./src/**/*.html", "./src/**/*.js"],
};
