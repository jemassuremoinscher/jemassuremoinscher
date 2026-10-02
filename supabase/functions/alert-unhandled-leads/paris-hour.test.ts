import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { isWithinAlertHours, parisHour } from "./paris-hour.ts";

// Heure d'été (2 octobre 2026, UTC+2) et heure d'hiver (15 janvier 2026, UTC+1).
const cases: { label: string; utc: string; hour: number; within: boolean }[] = [
  { label: "05h00 été", utc: "2026-10-02T03:00:00Z", hour: 5, within: false },
  { label: "08h00 été", utc: "2026-10-02T06:00:00Z", hour: 8, within: true },
  { label: "18h59 été", utc: "2026-10-02T16:59:00Z", hour: 18, within: true },
  { label: "19h00 été", utc: "2026-10-02T17:00:00Z", hour: 19, within: false },
  { label: "05h00 hiver", utc: "2026-01-15T04:00:00Z", hour: 5, within: false },
  { label: "08h00 hiver", utc: "2026-01-15T07:00:00Z", hour: 8, within: true },
  { label: "18h59 hiver", utc: "2026-01-15T17:59:00Z", hour: 18, within: true },
  { label: "19h00 hiver", utc: "2026-01-15T18:00:00Z", hour: 19, within: false },
  { label: "minuit", utc: "2026-10-01T22:00:00Z", hour: 0, within: false },
];

for (const c of cases) {
  Deno.test(`parisHour ${c.label}`, () => {
    const d = new Date(c.utc);
    assertEquals(parisHour(d), c.hour);
    assertEquals(isWithinAlertHours(d), c.within);
  });
}
