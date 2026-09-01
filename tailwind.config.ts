import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        outline: "hsl(var(--outline))",
        surface: "hsl(var(--surface))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "slide-in-left": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "60%": {
            transform: "translateX(10px)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "slide-out-left": {
          "0%": {
            transform: "translateX(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 260ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-left": "slide-in-left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-out-left": "slide-out-left 0.3s ease-in-out",
      },
      boxShadow: {
        "elevation-1": "0 1px 3px rgba(0,0,0,0.12)",
        "elevation-2": "0 3px 6px rgba(0,0,0,0.16)",
        "elevation-3": "0 5px 12px rgba(0,0,0,0.20)",
        "elevation-4": "0 15px 25px rgba(0,0,0,0.25)",
        // Ces 4 tokens existaient deja dans src/index.css (--shadow-card, etc.)
        // mais jamais exposes ici : chaque usage ecrivait shadow-[var(--shadow-hover)]
        // au lieu d'une classe Tailwind normale. Memes valeurs, zero changement visuel.
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
        elegant: "var(--shadow-elegant)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        "md-emphasized": "cubic-bezier(0.2, 0, 0, 1)",
        "md-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
        "md-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Memes valeurs que --md-duration-* dans src/index.css, exposees en classes
      // Tailwind pour le hover du point 6 (au lieu de duration-[200ms] partout).
      transitionDuration: {
        "md-short": "200ms",
        "md-medium": "400ms",
        "md-long": "550ms",
      },
      // Echelle de respiration verticale de section, absente jusqu'ici : le code
      // actuel melange py-6/8/10/12/14/16/20 sans logique sur la home. Ces 3
      // paliers servent de base au point 2 (rien n'est encore applique a une page).
      spacing: {
        "section-sm": "3.5rem",   // 56px  — sections compactes (ex: Partners)
        "section": "5rem",        // 80px  — rythme standard
        "section-lg": "7rem",     // 112px — sections d'ancrage (Hero-adjacent)
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
