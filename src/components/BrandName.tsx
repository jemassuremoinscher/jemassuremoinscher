import { memo } from "react";

interface BrandNameProps {
  /** "white" for dark backgrounds (header/footer), "purple" for light backgrounds */
  variant?: "white" | "purple";
  className?: string;
}

const BrandName = memo(({ variant = "purple", className = "" }: BrandNameProps) => {
  const baseColor = variant === "white" ? "text-white" : "text-primary";
  
  return (
    <span className={`font-bold ${className}`}>
      <span className={baseColor}>jemassure</span>
      <span className="text-accent">moinscher</span>
      <span className={baseColor}>.fr</span>
    </span>
  );
});

BrandName.displayName = "BrandName";

export default BrandName;
