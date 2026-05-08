import fr from '../src/i18n/fr';
import en from '../src/i18n/en';
// Detect EN values that contain French-specific words/accents
const frenchOnly = /\b(gratuit|moins cher|sans engagement|découvr|économ|protégeant|santé|habitation|voiture|comparateur|votre|nous|c'est|qu'|à |de |en |le |la |les |des |est |sont |moins|cher|économisez|conseillers?|assureurs?|devis|jeune|conducteur|emprunteur|prévoyance|partenaires?|maison|chien|chat|véhicule|façon|résili|garanties?|tarifs?|pas chère?|meilleure?s?)\b/i;
const accents = /[àâäéèêëïîôöùûüÿç]/;
let count = 0;
const out: string[] = [];
for (const k of Object.keys(en)) {
  const v = (en as any)[k];
  if (typeof v!=='string') continue;
  if (accents.test(v) || frenchOnly.test(v)) {
    out.push(`${k} => ${v}`); count++;
  }
}
console.log('Suspicious EN entries:', count);
console.log(out.slice(0,500).join('\n'));
