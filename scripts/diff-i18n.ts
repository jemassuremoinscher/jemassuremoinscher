import fr from '../src/i18n/fr';
import en from '../src/i18n/en';
const frKeys = Object.keys(fr);
const enKeys = Object.keys(en);
const missingInEn = frKeys.filter(k => !(k in en));
console.log('FR:', frKeys.length, 'EN:', enKeys.length, 'Missing in EN:', missingInEn.length);
missingInEn.forEach(k=>console.log(' -',k,'=>',(fr as any)[k].slice(0,100)));
console.log('---LOOKS FRENCH IN EN---');
const re = /\b(gratuit|assurez|moins cher|votre|nous|sans engagement|découvrez|économies|protégeant|comparateur|santé|habitation|voiture|pour|avec|votre|c'est|qu'|à |de |en |le |la |les |des |est |sont |moins|cher|économisez)\b/i;
let count = 0;
for (const k of enKeys) {
  const v = (en as any)[k];
  if (typeof v==='string' && re.test(v) && !/^(EN|En|FR)$/.test(v)) { console.log(' ?',k,'=>',v.slice(0,140)); count++; }
}
console.log('Total suspicious:', count);
