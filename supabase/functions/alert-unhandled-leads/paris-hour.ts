// Heure de Paris (0-23) pour la garde horaire de l'alerte.
// formatToParts plutôt que format() : avec la locale fr-FR, format() renvoie
// "05 h", que Number() transforme en NaN ; la garde 8h-19h ne se déclenchait
// alors jamais (corrigé le 2026-10-02).
const PARIS_HOUR = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  hourCycle: "h23",
});

export function parisHour(d: Date): number {
  const part = PARIS_HOUR.formatToParts(d).find((p) => p.type === "hour")?.value;
  const hour = Number(part);
  if (!Number.isInteger(hour)) throw new Error(`Heure de Paris illisible : ${part}`);
  return hour % 24;
}

// Plage d'envoi des alertes : de 8h00 à 18h59, heure de Paris.
export const isWithinAlertHours = (d: Date): boolean => {
  const hour = parisHour(d);
  return hour >= 8 && hour < 19;
};
