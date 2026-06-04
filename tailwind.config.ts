import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EduDhruv brand — extracted from official logo
        brand: {
          DEFAULT: "#3AAFE5",   // DHRUV sky blue
          dark:    "#2090C5",   // darker hover state
          darker:  "#1575A8",   // deep press state
          light:   "#EBF7FD",   // very light blue bg
          50:      "#F0FAFF",
        },
        edu: {
          dark:   "#555555",    // EDU charcoal gray
          darker: "#333333",
        },
        gold: {
          DEFAULT: "#F5A71A",   // star gold
          light:   "#FEF3D9",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(58,175,229,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
