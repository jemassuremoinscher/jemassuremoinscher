import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// Fallback skeleton for loading state
const IconFallback = ({ size = 24 }: { size?: number }) => (
  <div 
    className="animate-pulse bg-muted rounded"
    style={{ width: size, height: size }}
  />
);

export interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports;
  fallback?: React.ReactNode;
}

// Cache for loaded icon components
const iconCache = new Map<string, React.LazyExoticComponent<React.ComponentType<LucideProps>>>();

const DynamicIcon = ({ name, fallback, size = 24, ...props }: DynamicIconProps) => {
  // Get or create cached lazy component
  if (!iconCache.has(name)) {
    iconCache.set(name, lazy(dynamicIconImports[name]));
  }
  
  const LucideIcon = iconCache.get(name)!;
  
  return (
    <Suspense fallback={fallback || <IconFallback size={typeof size === 'number' ? size : 24} />}>
      <LucideIcon size={size} {...props} />
    </Suspense>
  );
};

export default DynamicIcon;

// Export icon names type for autocomplete
export type IconName = keyof typeof dynamicIconImports;
