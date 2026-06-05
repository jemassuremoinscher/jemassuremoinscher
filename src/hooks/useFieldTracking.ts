import { useRef, useCallback, useState } from 'react';

interface FieldHint {
  field: string;
  message: string;
}

const fieldHints: Record<string, string> = {
  coverageLevel: "Pas sûr ? Le Tiers+ est le meilleur rapport qualité/prix pour la plupart des conducteurs.",
  age: "Votre âge influence le tarif : les jeunes conducteurs (-25 ans) ont souvent des primes plus élevées.",
  postalCode: "Votre code postal est sur votre carte grise ou votre pièce d'identité.",
  bonusMalus: "Votre bonus/malus est indiqué sur votre dernier avis d'échéance, en haut à droite du document.",
  vehicleYear: "L'année de mise en circulation figure sur votre carte grise, au champ B.",
  fullName: "Indiquez votre nom tel qu'il apparaît sur vos documents officiels.",
  email: "Nous vous enverrons votre devis personnalisé à cette adresse.",
  phone: "Un conseiller vous rappelle sous 5 minutes au numéro indiqué.",
};

const HINT_DELAY_MS = 10_000;

export function useFieldTracking() {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [activeHint, setActiveHint] = useState<FieldHint | null>(null);

  const startTracking = useCallback((field: string) => {
    // Clear any existing timer for this field
    if (timers.current[field]) clearTimeout(timers.current[field]);

    timers.current[field] = setTimeout(() => {
      const message = fieldHints[field];
      if (message) {
        setActiveHint({ field, message });
      }
    }, HINT_DELAY_MS);
  }, []);

  const stopTracking = useCallback((field: string) => {
    if (timers.current[field]) {
      clearTimeout(timers.current[field]);
      delete timers.current[field];
    }
    setActiveHint(prev => prev?.field === field ? null : prev);
  }, []);

  const dismissHint = useCallback(() => {
    setActiveHint(null);
  }, []);

  return { activeHint, startTracking, stopTracking, dismissHint };
}
