import { useEffect, useRef, ReactNode, ElementType, CSSProperties } from "react";

type Variant = "up" | "fade" | "scale";

interface MdRevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  stagger?: boolean;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
  /** When true, replays each time the element re-enters the viewport */
  replay?: boolean;
}

const variantClass: Record<Variant, string> = {
  up: "md-reveal",
  fade: "md-reveal md-reveal-fade",
  scale: "md-reveal md-reveal-scale",
};

/**
 * MD3 Expressive scroll-reveal wrapper.
 * Respects prefers-reduced-motion (handled in CSS).
 * Uses IntersectionObserver — no JS animation work, GPU-friendly.
 */
const MdReveal = ({
  children,
  as: Tag = "div",
  variant = "up",
  stagger = false,
  delay,
  className = "",
  style,
  threshold = 0.12,
  replay = false,
}: MdRevealProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (!replay) io.unobserve(entry.target);
          } else if (replay) {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, replay]);

  const classes = `${variantClass[variant]} ${stagger ? "md-stagger" : ""} ${className}`.trim();
  const mergedStyle: CSSProperties = {
    ...(delay ? { animationDelay: `${delay}ms` } : null),
    ...style,
  };

  return (
    <Tag ref={ref as never} className={classes} style={mergedStyle}>
      {children}
    </Tag>
  );
};

export default MdReveal;
