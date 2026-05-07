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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

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
      mo.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  return null;
};

export default GlobalMdReveal;
