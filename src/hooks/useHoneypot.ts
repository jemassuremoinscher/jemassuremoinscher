import { useRef, useCallback } from 'react';

/**
 * Simple honeypot spam protection.
 * Adds a hidden field that bots auto-fill but humans don't see.
 * Call `isBot()` before submitting — returns true if honeypot was filled.
 */
export const useHoneypot = () => {
  const honeypotRef = useRef<HTMLInputElement>(null);

  const isBot = useCallback(() => {
    return honeypotRef.current?.value !== '';
  }, []);

  return { honeypotRef, isBot };
};
