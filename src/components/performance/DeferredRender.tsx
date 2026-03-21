import { ReactNode, useEffect, useRef, useState } from "react";

interface DeferredRenderProps {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  className?: string;
}

const DeferredRender = ({
  children,
  minHeight = 560,
  rootMargin = "120px 0px",
  className,
}: DeferredRenderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? children : <div aria-hidden="true" style={{ minHeight }} />}
    </div>
  );
};

export default DeferredRender;
