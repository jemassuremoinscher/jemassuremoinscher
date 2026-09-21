import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global MD3 Expressive scroll-reveal activator.
 * Auto-attaches reveal animations to <section>, <article>, and direct children of <main>
 * on every route change. Respects prefers-reduced-motion (via CSS).
 *
 * Opt-out: add data-no-reveal to an element to skip it.
 * Opt-in variant: add data-reveal="fade|scale|up" to override.
 */
const SELECTOR = [
  "main > section",
  "main > article",
  "main > div",
  "main section",
  "main article",
].join(",");

const GlobalMdReveal = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    const observed = new WeakSet<Element>();

    // Seuil IntersectionObserver de 10 % de la surface de l'élément, avec une
    // zone utile de 94 % de la fenêtre (rootMargin -6 %) : un élément plus
    // haut que ~9,4 fenêtres ne peut jamais l'atteindre et resterait à
    // opacity 0 pour toujours (constaté sur mobile : conteneur de 11 567 px
    // sur /assurance-velo, 9 822 px sur /assurance-scooter-50cc). On le révèle
    // donc sans attendre ; ses sections enfants gardent leur propre animation.
    const isTooTall = (el: Element) =>
      el.getBoundingClientRect().height * 0.1 > window.innerHeight * 0.94;

    let ro: ResizeObserver | null = null;
    const reveal = (el: Element) => {
      el.classList.add("is-visible");
      io.unobserve(el);
      ro?.unobserve(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    // ResizeObserver : la hauteur d'un conteneur grandit après coup (contenu
    // lazy, images) ; on réévalue donc à chaque changement de taille.
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        entries.forEach(({ target }) => {
          if (isTooTall(target)) reveal(target);
        });
      });
    }

    const tag = (el: Element) => {
      if (observed.has(el)) return;
      if (el.hasAttribute("data-no-reveal")) return;
      // Skip if ancestor opts out
      if (el.closest("[data-no-reveal]")) return;

      const variant = el.getAttribute("data-reveal") || "up";
      el.classList.add("md-reveal");
      if (variant === "fade") el.classList.add("md-reveal-fade");
      else if (variant === "scale") el.classList.add("md-reveal-scale");

      // If element is already in viewport on mount, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
        ro?.observe(el);
      }
      observed.add(el);
    };

    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach(tag);
    };

    // Initial scan + observe DOM mutations (lazy-loaded content)
    raf = window.requestAnimationFrame(scan);
    const mo = new MutationObserver(() => {
      window.requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      ro?.disconnect();
      mo.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  return null;
};

export default GlobalMdReveal;
