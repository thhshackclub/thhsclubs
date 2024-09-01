import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-syne)"],
      },
      colors: {
        bg: "#E6E6E6",
        primary: "#8F250C",
        accent: "#FF8552",
        light: "#E6E6E6",
        dark: "#06070E",
      },
    },
  },
  plugins: [],
};
export default config;
