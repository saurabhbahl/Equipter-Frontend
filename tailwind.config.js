/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      padding: {
        xl: "1rem",
      },
      maxWidth: {
        "2xl": "1300px",
      },
      center: true,
    },
    extend: {
      colors: {
        "custom-orange": "#ea7600",
        "custom-orange-100": "#F6841F",
        "custom-gray": "#444",
        "custom-gray-200": "#767676",
        "custom-gray-300": "#f5f5f5",
        "custom-gray-400": "#d9d9d9",
        "custom-gray-500": "#666",
        "custom-black-200": "#1e1e1e",
        "custom-black-25": "rgba(0, 0, 0, 0.25)",
        "custom-red": "#EB5757",
        "custom-sky": "#E2E8F0",
      },
      fontFamily: {
        "work-sans": ["Work Sans", "sans-serif"],
        'arial': ["Arial", "sans-serif"],
        'robot': ["Roboto", "sans-serif"],
        'inter': ["Inter", "sans-serif"],
        "noto-sans": ["Noto Sans", "sans-serif"],
      },
      fontSize: {
        "64": ["64px", { lineHeight: "75px" }],
        "32": ["32px", { lineHeight: "37px" }],
        "27": ["27px", { lineHeight: "31px" }],
        "25": ["25px", { lineHeight: "29px" }],
        "19": ["19px", { lineHeight: "23px" }],
        "17": ["17px", { lineHeight: "19px" }],
        "15": ["15px", { lineHeight: "17px" }],
        "13": ["13px", { lineHeight: "16px" }],
        "10": ["10px", { lineHeight: "15px" }],
        xxs: ["8px", { lineHeight: "10px" }],
      },
      borderStyle: {
        inset: "inset",
      },
    },
    screens: {
      xs: "320px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1440px",
      "3xl": "1920px",
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          "@screen xs": {
            maxWidth: "100%",
          },
          "@screen sm": {
            maxWidth: "540px",
          },
          "@screen md": {
            maxWidth: "720px",
          },
          "@screen lg": {
            maxWidth: "960px",
          },
          "@screen xl": {
            maxWidth: "1190px",
          },
          "@screen 2xl": {
            maxWidth: "1345px",
          },
        },
      });
    },
  ],
};
