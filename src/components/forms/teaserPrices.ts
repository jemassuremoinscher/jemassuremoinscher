// Vignettes de l'étape contact du tunnel de devis (MultiStepQuoteForm).
// Module à part pour être lu aussi par scripts/verify-teasers.mjs (verrou de
// build) et par le test E2E des tunnels (npm run qa:funnels).
//
// Règles (décisions du 3 octobre 2026) :
// - chaque produit ayant une étape contact a une entrée ici ;
// - aucun badge « Meilleur prix » ;
// - noms des vignettes identiques aux libellés de l'étape formule du produit ;
// - animaux : uniquement des assureurs spécialisés.

import logoDirectAssurance from '@/assets/logos/direct-assurance-new.webp';
import logoAllianz from '@/assets/logos/allianz.webp';
import logoAxa from '@/assets/logos/axa.webp';
import logoAmaguiz from '@/assets/logos/amaguiz.png';
import logoMaif from '@/assets/logos/maif.webp';
import logoGroupama from '@/assets/logos/groupama.png';
import logoAlanNew from '@/assets/logos/alan-new.webp';
import logoHarmonie from '@/assets/logos/harmonie-mutuelle.png';
import logoApril from '@/assets/logos/april-new.png';
import logoCardif from '@/assets/logos/cardif.png';
import logoGenerali from '@/assets/logos/generali-new.png';
import logoAcheel from '@/assets/logos/acheel.webp';
import logoSwisslife from '@/assets/logos/swisslife.webp';
import logoAon from '@/assets/logos/aon.webp';
import logoMacif from '@/assets/logos/macif-new.webp';
import logoMatmut from '@/assets/logos/matmut-new.webp';
import logoMaaf from '@/assets/logos/maaf.webp';
import logoMma from '@/assets/logos/mma-new.webp';
import logoGmf from '@/assets/logos/gmf-new.webp';
import logoAbeille from '@/assets/logos/abeille.webp';
import logoLeocare from '@/assets/logos/leocare.webp';
import logoLolivier from '@/assets/logos/lolivier.webp';
import logoLuko from '@/assets/logos/luko.png';
import logoMalakoff from '@/assets/logos/malakoff-humanis.png';
import logoMutuelleGenerale from '@/assets/logos/mutuelle-generale.png';
import logoMgen from '@/assets/logos/mgen.png';
import logoAg2r from '@/assets/logos/ag2r.png';
import logoAprilMoto from '@/assets/logos/april-moto.png';
import logoAmv from '@/assets/logos/amv.webp';
import logoSollyAzar from '@/assets/logos/solly-azar.png';
import logoAssu2000 from '@/assets/logos/assu-2000.png';
import logoWilov from '@/assets/logos/wilov.webp';
import logoOrnikar from '@/assets/logos/ornikar.webp';
import logoGoodflair from '@/assets/logos/goodflair.png';
import logoLcl from '@/assets/logos/lcl.png';
import logoMetlife from '@/assets/logos/metlife.png';
import logoBulleBleue from '@/assets/logos/bulle-bleue.png';
import logoSantevet from '@/assets/logos/santevet.png';
import logoFidanimo from '@/assets/logos/fidanimo.png';
import logoAnimauxSante from '@/assets/logos/animaux-sante.png';
import logoNeo from '@/assets/logos/neo.webp';
import logoMpa from '@/assets/logos/mpa.webp';
import logoAComme from '@/assets/logos/a-comme-assure.png';

// ─── Teaser Prices by insurance type ─────────────────────────────────────────
// Note: `logoPool` is rotated per session in ContactStep so two consecutive
// devis don't show the same insurers. Prices reflect realistic FR market 2026.
// Assureurs spécialisés dans l'animal, seuls autorisés dans les vignettes
// animaux (vérifié par scripts/verify-teasers.mjs et le test E2E).
export const ANIMAUX_POOL = [logoSantevet, logoAcheel, logoFidanimo, logoBulleBleue, logoAnimauxSante, logoGoodflair];

// Textes des vignettes : clés i18n (étape 2, 2026-10-03). Les noms reprennent
// les clés des libellés de formule quand ils sont identiques en français.
type TFn = (key: string, vars?: Record<string, string | number>) => string;

export type TeaserTier = { name: string; price?: string; badge?: string; logoPool: string[]; features: string[] };
export const buildTeaserPrices = (t: TFn): Record<string, { label: string; prices: TeaserTier[] }> => ({
  auto: { label: t('teaser.auto.label'), prices: [
    { name: t('teaser.auto.1.name'), price: '14€', badge: t('teaser.badge.des'), logoPool: [logoDirectAssurance, logoLolivier, logoLeocare, logoOrnikar, logoAssu2000, logoAmaguiz], features: [t('teaser.auto.1.feature1'), t('teaser.auto.1.feature2'), t('teaser.auto.1.feature3')] },
    { name: t('teaser.auto.2.name'), price: '24€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoMaif, logoMacif, logoMatmut, logoMaaf, logoMma, logoAbeille], features: [t('teaser.auto.2.feature1'), t('teaser.auto.2.feature2'), t('teaser.auto.2.feature3'), t('teaser.auto.2.feature4')] },
    { name: t('teaser.auto.3.name'), price: '37€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoGroupama, logoGenerali, logoGmf, logoAllianz, logoLuko], features: [t('teaser.auto.3.feature1'), t('teaser.auto.3.feature2'), t('teaser.auto.3.feature3'), t('teaser.auto.3.feature4')] },
  ]},
  moto: { label: t('teaser.moto.label'), prices: [
    { name: t('teaser.moto.1.name'), price: '11€', badge: t('teaser.badge.des'), logoPool: [logoAmaguiz, logoAprilMoto, logoAmv, logoSollyAzar, logoAssu2000], features: [t('teaser.moto.1.feature1'), t('teaser.moto.1.feature2'), t('teaser.moto.1.feature3')] },
    { name: t('teaser.moto.2.name'), price: '20€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoMaif, logoMacif, logoMma, logoAbeille], features: [t('teaser.moto.2.feature1'), t('teaser.moto.2.feature2'), t('teaser.moto.2.feature3')] },
    { name: t('teaser.moto.3.name'), price: '34€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoGroupama, logoGenerali, logoGmf, logoMaaf], features: [t('teaser.moto.3.feature1'), t('teaser.moto.3.feature2'), t('teaser.moto.3.feature3'), t('teaser.moto.3.feature4')] },
  ]},
  habitation: { label: t('teaser.habitation.label'), prices: [
    { name: t('teaser.habitation.1.name'), price: '6€', badge: t('teaser.badge.des'), logoPool: [logoDirectAssurance, logoLuko, logoLolivier, logoLeocare, logoAcheel], features: [t('teaser.habitation.1.feature1'), t('teaser.habitation.1.feature2'), t('teaser.habitation.1.feature3')] },
    { name: t('teaser.habitation.2.name'), price: '11€', badge: t('teaser.badge.des'), logoPool: [logoMaif, logoMacif, logoMatmut, logoMma, logoAbeille], features: [t('teaser.habitation.2.feature1'), t('teaser.habitation.2.feature2'), t('teaser.habitation.2.feature3'), t('teaser.habitation.2.feature4')] },
    { name: t('teaser.habitation.3.name'), price: '19€', badge: t('teaser.badge.des'), logoPool: [logoGroupama, logoAxa, logoAllianz, logoGenerali, logoMaaf, logoGmf], features: [t('teaser.habitation.3.feature1'), t('teaser.habitation.3.feature2'), t('teaser.habitation.3.feature3'), t('teaser.habitation.3.feature4')] },
  ]},
  sante: { label: t('teaser.sante.label'), prices: [
    { name: t('teaser.sante.1.name'), price: '14€', badge: t('teaser.badge.des'), logoPool: [logoAlanNew, logoAcheel, logoMgen, logoMutuelleGenerale], features: [t('teaser.sante.1.feature1'), t('teaser.sante.1.feature2'), t('teaser.sante.1.feature3')] },
    { name: t('teaser.sante.2.name'), price: '26€', badge: t('teaser.badge.des'), logoPool: [logoHarmonie, logoMalakoff, logoAg2r, logoApril, logoSwisslife], features: [t('teaser.sante.2.feature1'), t('teaser.sante.2.feature2'), t('teaser.sante.2.feature3'), t('teaser.sante.2.feature4')] },
    { name: t('teaser.sante.3.name'), price: '44€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoAllianz, logoGenerali, logoMetlife, logoMaaf], features: [t('teaser.sante.3.feature1'), t('teaser.sante.3.feature2'), t('teaser.sante.3.feature3'), t('teaser.sante.3.feature4')] },
  ]},
  pret: { label: t('teaser.pret.label'), prices: [
    { name: t('teaser.pret.1.name'), price: '7€', badge: t('teaser.badge.des'), logoPool: [logoApril, logoCardif, logoMetlife, logoLcl], features: [t('teaser.pret.1.feature1'), t('teaser.pret.1.feature2'), t('teaser.pret.1.feature3')] },
    { name: t('teaser.pret.2.name'), price: '12€', badge: t('teaser.badge.des'), logoPool: [logoCardif, logoSwisslife, logoGenerali, logoApril], features: [t('teaser.pret.2.feature1'), t('teaser.pret.2.feature2'), t('teaser.pret.2.feature3')] },
    { name: t('teaser.pret.3.name'), price: '19€', badge: t('teaser.badge.des'), logoPool: [logoGenerali, logoAxa, logoAllianz, logoMetlife], features: [t('teaser.pret.3.feature1'), t('teaser.pret.3.feature2'), t('teaser.pret.3.feature3'), t('teaser.pret.3.feature4')] },
  ]},
  animaux: { label: t('teaser.animaux.label'), prices: [
    // Aucun prix ni taux/plafond animaux (décision de Paul) : « Sur devis ».
    // Même pool ordonné de 6 assureurs spécialisés pour les 3 vignettes :
    // pool[(rotationSeed + i*7) % 6] donne trois logos toujours différents.
    // Noms = libellés de step.animaux.formule.opt.*.label (fr).
    { name: t('step.animaux.formule.opt.accident.label'), logoPool: ANIMAUX_POOL, features: [t('teaser.animaux.1.feature1')] },
    { name: t('step.animaux.formule.opt.maladie_accident.label'), logoPool: ANIMAUX_POOL, features: [t('teaser.animaux.2.feature1'), t('teaser.animaux.2.feature2'), t('teaser.animaux.2.feature3')] },
    { name: t('step.animaux.formule.opt.integrale.label'), logoPool: ANIMAUX_POOL, features: [t('teaser.animaux.3.feature1'), t('teaser.animaux.3.feature2'), t('teaser.animaux.3.feature3')] },
  ]},
  vie: { label: t('teaser.vie.label'), prices: [
    { name: t('teaser.vie.1.name'), price: '0€ frais', badge: t('teaser.badge.des'), logoPool: [logoSwisslife, logoCardif, logoLcl, logoApril], features: [t('teaser.vie.1.feature1'), t('teaser.vie.1.feature2'), t('teaser.vie.1.feature3')] },
    { name: t('teaser.vie.2.name'), price: '0,6%', badge: t('teaser.badge.frais'), logoPool: [logoGenerali, logoSwisslife, logoAllianz, logoCardif], features: [t('teaser.vie.2.feature1'), t('teaser.vie.2.feature2'), t('teaser.vie.2.feature3'), t('teaser.vie.2.feature4')] },
    { name: t('teaser.vie.3.name'), price: '0,9%', badge: t('teaser.badge.frais'), logoPool: [logoAxa, logoGenerali, logoMetlife, logoAllianz], features: [t('teaser.vie.3.feature1'), t('teaser.vie.3.feature2'), t('teaser.vie.3.feature3'), t('teaser.vie.3.feature4')] },
  ]},
  prevoyance: { label: t('teaser.prevoyance.label'), prices: [
    { name: t('teaser.prevoyance.1.name'), price: '11€', badge: t('teaser.badge.des'), logoPool: [logoApril, logoMalakoff, logoAg2r, logoMutuelleGenerale], features: [t('teaser.prevoyance.1.feature1'), t('teaser.prevoyance.1.feature2'), t('teaser.prevoyance.1.feature3')] },
    { name: t('teaser.prevoyance.2.name'), price: '21€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoSwisslife, logoHarmonie, logoApril], features: [t('teaser.prevoyance.2.feature1'), t('teaser.prevoyance.2.feature2'), t('teaser.prevoyance.2.feature3'), t('teaser.prevoyance.2.feature4')] },
    { name: t('teaser.prevoyance.3.name'), price: '37€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoGenerali, logoMetlife, logoCardif], features: [t('teaser.prevoyance.3.feature1'), t('teaser.prevoyance.3.feature2'), t('teaser.prevoyance.3.feature3'), t('teaser.prevoyance.3.feature4')] },
  ]},
  rc_pro: { label: t('teaser.rc_pro.label'), prices: [
    { name: t('teaser.rc_pro.1.name'), price: '14€', badge: t('teaser.badge.des'), logoPool: [logoAon, logoApril, logoAComme, logoSollyAzar], features: [t('teaser.rc_pro.1.feature1'), t('teaser.rc_pro.1.feature2'), t('teaser.rc_pro.1.feature3')] },
    { name: t('teaser.rc_pro.2.name'), price: '26€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoMma, logoMaaf, logoGenerali], features: [t('teaser.rc_pro.2.feature1'), t('teaser.rc_pro.2.feature2'), t('teaser.rc_pro.2.feature3'), t('teaser.rc_pro.2.feature4')] },
    { name: t('teaser.rc_pro.3.name'), price: '44€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoAllianz, logoGenerali, logoAbeille], features: [t('teaser.rc_pro.3.feature1'), t('teaser.rc_pro.3.feature2'), t('teaser.rc_pro.3.feature3'), t('teaser.rc_pro.3.feature4')] },
  ]},
  mrp: { label: t('teaser.mrp.label'), prices: [
    { name: t('teaser.mrp.1.name'), price: '26€', badge: t('teaser.badge.des'), logoPool: [logoGenerali, logoMma, logoMaaf, logoAbeille], features: [t('teaser.mrp.1.feature1'), t('teaser.mrp.1.feature2'), t('teaser.mrp.1.feature3')] },
    { name: t('teaser.mrp.2.name'), price: '44€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoGroupama, logoMaif, logoMacif], features: [t('teaser.mrp.2.feature1'), t('teaser.mrp.2.feature2'), t('teaser.mrp.2.feature3'), t('teaser.mrp.2.feature4')] },
    { name: t('teaser.mrp.3.name'), price: '71€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoGenerali, logoAllianz, logoAbeille], features: [t('teaser.mrp.3.feature1'), t('teaser.mrp.3.feature2'), t('teaser.mrp.3.feature3'), t('teaser.mrp.3.feature4')] },
  ]},
  gli: { label: t('teaser.gli.label'), prices: [
    { name: t('teaser.gli.1.name'), price: '2,5%', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoMma, logoMaaf], features: [t('teaser.gli.1.feature1'), t('teaser.gli.1.feature2'), t('teaser.gli.1.feature3')] },
    { name: t('teaser.gli.2.name'), price: '3%', badge: t('teaser.badge.des'), logoPool: [logoGenerali, logoGroupama, logoAbeille], features: [t('teaser.gli.2.feature1'), t('teaser.gli.2.feature2'), t('teaser.gli.2.feature3'), t('teaser.gli.2.feature4')] },
    { name: t('teaser.gli.3.name'), price: '3,5%', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoAllianz, logoGenerali], features: [t('teaser.gli.3.feature1'), t('teaser.gli.3.feature2'), t('teaser.gli.3.feature3'), t('teaser.gli.3.feature4')] },
  ]},
  pno: { label: t('teaser.pno.label'), prices: [
    { name: t('teaser.pno.1.name'), price: '6€', badge: t('teaser.badge.des'), logoPool: [logoDirectAssurance, logoLuko, logoLolivier, logoAcheel], features: [t('teaser.pno.1.feature1'), t('teaser.pno.1.feature2'), t('teaser.pno.1.feature3')] },
    { name: t('teaser.pno.2.name'), price: '11€', badge: t('teaser.badge.des'), logoPool: [logoMaif, logoMacif, logoMatmut, logoAbeille], features: [t('teaser.pno.2.feature1'), t('teaser.pno.2.feature2'), t('teaser.pno.2.feature3'), t('teaser.pno.2.feature4')] },
    { name: t('teaser.pno.3.name'), price: '17€', badge: t('teaser.badge.des'), logoPool: [logoGroupama, logoAxa, logoAllianz, logoGenerali], features: [t('teaser.pno.3.feature1'), t('teaser.pno.3.feature2'), t('teaser.pno.3.feature3'), t('teaser.pno.3.feature4')] },
  ]},
  gestion_locative: { label: t('teaser.gestion_locative.label'), prices: [
    { name: t('teaser.gestion_locative.1.name'), price: '5%', badge: t('teaser.badge.des'), logoPool: [logoMaif, logoMacif, logoAbeille], features: [t('teaser.gestion_locative.1.feature1'), t('teaser.gestion_locative.1.feature2'), t('teaser.gestion_locative.1.feature3')] },
    { name: t('teaser.gestion_locative.2.name'), price: '7%', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoMma, logoGenerali], features: [t('teaser.gestion_locative.2.feature1'), t('teaser.gestion_locative.2.feature2'), t('teaser.gestion_locative.2.feature3'), t('teaser.gestion_locative.2.feature4')] },
    { name: t('teaser.gestion_locative.3.name'), price: '9%', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoAllianz, logoGroupama], features: [t('teaser.gestion_locative.3.feature1'), t('teaser.gestion_locative.3.feature2'), t('teaser.gestion_locative.3.feature3'), t('teaser.gestion_locative.3.feature4')] },
  ]},
  // Trottinette (décision du 3 octobre 2026) : trois vignettes « Sur devis »,
  // noms identiques aux libellés de l'étape trot_formule. Seul le logo April
  // (contrat d'entrée de gamme mis en avant sur /assurance-trottinette) ; vol,
  // casse et assistance ne sont pas promis chez lui : « selon l'assureur ».
  trottinette: { label: t('teaser.trottinette.label'), prices: [
    { name: t('step.trottinette.trot_formule.opt.rc.label'), logoPool: [logoApril], features: [t('teaser.trottinette.1.feature1'), t('teaser.trottinette.1.feature2')] },
    { name: t('step.trottinette.trot_formule.opt.rc_vol.label'), logoPool: [logoApril], features: [t('teaser.trottinette.2.feature1'), t('teaser.trottinette.2.feature2')] },
    { name: t('step.trottinette.trot_formule.opt.tous_risques.label'), logoPool: [logoApril], features: [t('teaser.trottinette.3.feature1'), t('teaser.trottinette.3.feature2'), t('teaser.trottinette.3.feature3')] },
  ]},
  velo: { label: t('teaser.velo.label'), prices: [
    { name: t('step.velo.velo_formule.opt.vol.label'), price: '3€', badge: t('teaser.badge.des'), logoPool: [logoAcheel, logoLuko, logoLeocare, logoNeo], features: [t('teaser.velo.1.feature1')] },
    { name: t('step.velo.velo_formule.opt.vol_casse.label'), price: '7€', badge: t('teaser.badge.des'), logoPool: [logoMaif, logoMacif, logoAllianz, logoMaaf], features: [t('teaser.velo.2.feature1'), t('teaser.velo.2.feature2')] },
    { name: t('step.velo.velo_formule.opt.tous_risques.label'), price: '11€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoGenerali, logoGroupama, logoAbeille], features: [t('teaser.velo.3.feature1'), t('teaser.velo.3.feature2'), t('teaser.velo.3.feature3')] },
  ]},
  camping_car: { label: t('teaser.camping_car.label'), prices: [
    { name: t('step.camping_car.cc_formule.opt.tiers.label'), price: '21€', badge: t('teaser.badge.des'), logoPool: [logoMacif, logoMaif, logoMaaf, logoMma], features: [t('teaser.camping_car.1.feature1'), t('teaser.camping_car.1.feature2')] },
    { name: t('step.camping_car.cc_formule.opt.tiers_plus.label'), price: '34€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoGroupama, logoMatmut, logoAbeille], features: [t('teaser.camping_car.2.feature1'), t('teaser.camping_car.2.feature2')] },
    { name: t('step.camping_car.cc_formule.opt.tous_risques.label'), price: '54€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoGenerali, logoGmf, logoAllianz], features: [t('teaser.camping_car.3.feature1'), t('teaser.camping_car.3.feature2')] },
  ]},
  sans_permis: { label: t('teaser.sans_permis.label'), prices: [
    { name: t('step.sans_permis.sp_formule.opt.tiers.label'), price: '17€', badge: t('teaser.badge.des'), logoPool: [logoSollyAzar, logoAssu2000, logoAComme, logoAmaguiz], features: [t('teaser.sans_permis.1.feature1'), t('teaser.sans_permis.1.feature2')] },
    { name: t('step.sans_permis.sp_formule.opt.tiers_plus.label'), price: '26€', badge: t('teaser.badge.des'), logoPool: [logoMma, logoMaaf, logoMacif, logoAbeille], features: [t('teaser.sans_permis.2.feature1'), t('teaser.sans_permis.2.feature2')] },
    { name: t('step.sans_permis.sp_formule.opt.tous_risques.label'), price: '39€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoAllianz, logoGroupama, logoGenerali], features: [t('teaser.sans_permis.3.feature1'), t('teaser.sans_permis.3.feature2')] },
  ]},
  // Auto temporaire : « Sur devis » (décision du 3 octobre 2026). Les anciens
  // prix (6/26/67€) étaient des tarifs pour 1, 7 et 30 jours affichés en
  // « /mois », et ces durées ne correspondent pas aux options du formulaire
  // (1-3 j, 4-15 j, 16-90 j).
  auto_temporaire: { label: t('teaser.auto_temporaire.label'), prices: [
    { name: t('step.auto_temporaire.at_formule.opt.tiers.label'), logoPool: [logoWilov, logoOrnikar, logoLeocare, logoGoodflair], features: [t('teaser.auto_temporaire.1.feature1'), t('teaser.auto_temporaire.1.feature2')] },
    { name: t('step.auto_temporaire.at_formule.opt.tiers_plus.label'), logoPool: [logoLeocare, logoOrnikar, logoWilov, logoLolivier], features: [t('teaser.auto_temporaire.2.feature1')] },
    { name: t('step.auto_temporaire.at_formule.opt.tous_risques.label'), logoPool: [logoAllianz, logoAxa, logoMacif, logoLeocare], features: [t('teaser.auto_temporaire.3.feature1')] },
  ]},
  flotte: { label: t('teaser.flotte.label'), prices: [
    { name: t('teaser.flotte.1.name'), price: '29€', badge: t('teaser.badge.parVehicule'), logoPool: [logoMacif, logoMaaf, logoMma, logoMatmut], features: [t('teaser.flotte.1.feature1'), t('teaser.flotte.1.feature2'), t('teaser.flotte.1.feature3')] },
    { name: t('teaser.flotte.2.name'), price: '49€', badge: t('teaser.badge.parVehicule'), logoPool: [logoAllianz, logoGroupama, logoGenerali, logoAbeille], features: [t('teaser.flotte.2.feature1'), t('teaser.flotte.2.feature2'), t('teaser.flotte.2.feature3')] },
    { name: t('teaser.flotte.3.name'), price: '79€', badge: t('teaser.badge.parVehicule'), logoPool: [logoAxa, logoAllianz, logoGenerali, logoMaaf], features: [t('teaser.flotte.3.feature1'), t('teaser.flotte.3.feature2'), t('teaser.flotte.3.feature3')] },
  ]},
  cyber: { label: t('teaser.cyber.label'), prices: [
    { name: t('teaser.cyber.1.name'), price: '29€', badge: t('teaser.badge.des'), logoPool: [logoAon, logoApril, logoSollyAzar, logoMma], features: [t('teaser.cyber.1.feature1'), t('teaser.cyber.1.feature2'), t('teaser.cyber.1.feature3')] },
    { name: t('teaser.cyber.2.name'), price: '67€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoMma, logoMaaf, logoGenerali], features: [t('teaser.cyber.2.feature1'), t('teaser.cyber.2.feature2'), t('teaser.cyber.2.feature3')] },
    { name: t('teaser.cyber.3.name'), price: '119€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoAllianz, logoGenerali, logoAbeille], features: [t('teaser.cyber.3.feature1'), t('teaser.cyber.3.feature2'), t('teaser.cyber.3.feature3')] },
  ]},
  decennale: { label: t('teaser.decennale.label'), prices: [
    { name: t('teaser.decennale.1.name'), price: '67€', badge: t('teaser.badge.des'), logoPool: [logoSollyAzar, logoMaaf, logoAssu2000, logoMma], features: [t('teaser.decennale.1.feature1'), t('teaser.decennale.1.feature2'), t('teaser.decennale.1.feature3')] },
    { name: t('teaser.decennale.2.name'), price: '112€', badge: t('teaser.badge.des'), logoPool: [logoMma, logoMaaf, logoGenerali, logoAllianz], features: [t('teaser.decennale.2.feature1'), t('teaser.decennale.2.feature2'), t('teaser.decennale.2.feature3')] },
    { name: t('teaser.decennale.3.name'), price: '172€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoAllianz, logoGenerali, logoAbeille], features: [t('teaser.decennale.3.feature1'), t('teaser.decennale.3.feature2'), t('teaser.decennale.3.feature3')] },
  ]},
  protection_juridique: { label: t('teaser.protection_juridique.label'), prices: [
    { name: t('step.protection_juridique.pj_formule.opt.essentielle.label'), price: '7€', badge: t('teaser.badge.des'), logoPool: [logoMaif, logoMacif, logoMatmut, logoMaaf], features: [t('teaser.protection_juridique.1.feature1'), t('teaser.protection_juridique.1.feature2'), t('teaser.protection_juridique.1.feature3')] },
    { name: t('step.protection_juridique.pj_formule.opt.confort.label'), price: '12€', badge: t('teaser.badge.des'), logoPool: [logoAllianz, logoGroupama, logoMma, logoAbeille], features: [t('teaser.protection_juridique.2.feature1'), t('teaser.protection_juridique.2.feature2'), t('teaser.protection_juridique.2.feature3')] },
    { name: t('step.protection_juridique.pj_formule.opt.premium.label'), price: '19€', badge: t('teaser.badge.des'), logoPool: [logoAxa, logoGenerali, logoAllianz, logoMaaf], features: [t('teaser.protection_juridique.3.feature1'), t('teaser.protection_juridique.3.feature2'), t('teaser.protection_juridique.3.feature3')] },
  ]},
  mutuelle_entreprise: { label: t('teaser.mutuelle_entreprise.label'), prices: [
    { name: t('step.mutuelle_entreprise.me_niveau.opt.socle_anim.label'), price: '17€', badge: t('teaser.badge.parSalarie'), logoPool: [logoAlanNew, logoMutuelleGenerale, logoMgen, logoAcheel], features: [t('teaser.mutuelle_entreprise.1.feature1'), t('teaser.mutuelle_entreprise.1.feature2'), t('teaser.mutuelle_entreprise.1.feature3')] },
    { name: t('step.mutuelle_entreprise.me_niveau.opt.intermediaire.label'), price: '29€', badge: t('teaser.badge.parSalarie'), logoPool: [logoHarmonie, logoMalakoff, logoAg2r, logoApril], features: [t('teaser.mutuelle_entreprise.2.feature1'), t('teaser.mutuelle_entreprise.2.feature2'), t('teaser.mutuelle_entreprise.2.feature3')] },
    { name: t('step.mutuelle_entreprise.me_niveau.opt.premium.label'), price: '49€', badge: t('teaser.badge.parSalarie'), logoPool: [logoAxa, logoAllianz, logoGenerali, logoMetlife], features: [t('teaser.mutuelle_entreprise.3.feature1'), t('teaser.mutuelle_entreprise.3.feature2')] },
  ]},
});
