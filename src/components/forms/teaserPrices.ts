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

export type TeaserTier = { name: string; price?: string; badge?: string; logoPool: string[]; features: string[] };
export const teaserPrices: Record<string, { label: string; prices: TeaserTier[] }> = {
  auto: { label: 'Assurance Auto', prices: [
    { name: 'Tiers', price: '14€', badge: 'Dès', logoPool: [logoDirectAssurance, logoLolivier, logoLeocare, logoOrnikar, logoAssu2000, logoAmaguiz], features: ['Responsabilité civile obligatoire', 'Défense pénale et recours', 'Assistance 50 km du domicile'] },
    { name: 'Tiers +', price: '24€', badge: 'Dès', logoPool: [logoAllianz, logoMaif, logoMacif, logoMatmut, logoMaaf, logoMma, logoAbeille], features: ['Tout du Tiers', 'Vol et incendie', 'Bris de glace', 'Catastrophes naturelles'] },
    { name: 'Tous Risques', price: '37€', badge: 'Dès', logoPool: [logoAxa, logoGroupama, logoGenerali, logoGmf, logoAllianz, logoLuko], features: ['Tous dommages au véhicule', 'Vol, incendie, vandalisme', 'Bris de glace 0€ franchise', 'Véhicule de prêt'] },
  ]},
  moto: { label: 'Assurance Moto', prices: [
    { name: 'Tiers', price: '11€', badge: 'Dès', logoPool: [logoAmaguiz, logoAprilMoto, logoAmv, logoSollyAzar, logoAssu2000], features: ['Responsabilité civile', 'Défense pénale', 'Assistance dépannage'] },
    { name: 'Tiers +', price: '20€', badge: 'Dès', logoPool: [logoAllianz, logoMaif, logoMacif, logoMma, logoAbeille], features: ['Tout du Tiers', 'Vol et incendie', 'Équipement pilote 500€'] },
    { name: 'Tous Risques', price: '34€', badge: 'Dès', logoPool: [logoAxa, logoGroupama, logoGenerali, logoGmf, logoMaaf], features: ['Tous dommages moto', 'Vol et incendie', 'Équipement 1500€', 'Assistance 0 km'] },
  ]},
  habitation: { label: 'Assurance Habitation', prices: [
    { name: 'Essentielle', price: '6€', badge: 'Dès', logoPool: [logoDirectAssurance, logoLuko, logoLolivier, logoLeocare, logoAcheel], features: ['Responsabilité civile vie privée', 'Incendie et explosion', 'Dégâts des eaux'] },
    { name: 'Confort', price: '11€', badge: 'Dès', logoPool: [logoMaif, logoMacif, logoMatmut, logoMma, logoAbeille], features: ['Tout de l\'Essentielle', 'Vol et vandalisme', 'Bris de glace', 'Catastrophes naturelles'] },
    { name: 'Premium', price: '19€', badge: 'Dès', logoPool: [logoGroupama, logoAxa, logoAllianz, logoGenerali, logoMaaf, logoGmf], features: ['Couverture tous risques', 'Objets de valeur protégés', 'Protection juridique', 'Relogement inclus'] },
  ]},
  sante: { label: 'Mutuelle Santé', prices: [
    { name: 'Essentielle', price: '14€', badge: 'Dès', logoPool: [logoAlanNew, logoAcheel, logoMgen, logoMutuelleGenerale], features: ['Hospitalisation 100% BR', 'Soins courants 100%', 'Optique simple'] },
    { name: 'Confort', price: '26€', badge: 'Dès', logoPool: [logoHarmonie, logoMalakoff, logoAg2r, logoApril, logoSwisslife], features: ['Hospitalisation 200% BR', 'Dentaire 200%', 'Optique 200€/an', 'Médecines douces'] },
    { name: 'Premium', price: '44€', badge: 'Dès', logoPool: [logoAxa, logoAllianz, logoGenerali, logoMetlife, logoMaaf], features: ['Hospitalisation 300% BR', 'Dentaire 400%', 'Optique 500€/an', 'Chambre particulière'] },
  ]},
  pret: { label: 'Assurance Emprunteur', prices: [
    { name: 'Décès', price: '7€', badge: 'Dès', logoPool: [logoApril, logoCardif, logoMetlife, logoLcl], features: ['Garantie décès toutes causes', 'Capital remboursé à la banque', 'Couverture jusqu\'à 75 ans'] },
    { name: 'Décès + PTIA', price: '12€', badge: 'Dès', logoPool: [logoCardif, logoSwisslife, logoGenerali, logoApril], features: ['Décès', 'PTIA (perte totale d\'autonomie)', 'Délégation loi Lemoine'] },
    { name: 'Complète', price: '19€', badge: 'Dès', logoPool: [logoGenerali, logoAxa, logoAllianz, logoMetlife], features: ['Décès et PTIA', 'Invalidité (IPT, IPP)', 'Incapacité de travail (ITT)', 'Perte d\'emploi en option'] },
  ]},
  animaux: { label: 'Assurance Animaux', prices: [
    // Aucun prix ni taux/plafond animaux (décision de Paul) : « Sur devis ».
    // Même pool ordonné de 6 assureurs spécialisés pour les 3 vignettes :
    // pool[(rotationSeed + i*7) % 6] donne trois logos toujours différents.
    // Noms = libellés de step.animaux.formule.opt.*.label (fr).
    { name: 'Accidents', logoPool: ANIMAUX_POOL, features: ['Frais vétérinaires liés à un accident'] },
    { name: 'Maladie + Accident', logoPool: ANIMAUX_POOL, features: ['Accidents et maladies', 'Taux, plafond et franchise selon le contrat', 'Délais de carence selon le contrat'] },
    { name: 'Intégrale', logoPool: ANIMAUX_POOL, features: ['Accidents et maladies', 'Prévention (forfait ou option) selon le contrat', 'Exclusions : maladies préexistantes, congénitales ou héréditaires selon le contrat'] },
  ]},
  vie: { label: 'Assurance Vie', prices: [
    { name: 'Essentielle', price: '0€ frais', badge: 'Dès', logoPool: [logoSwisslife, logoCardif, logoLcl, logoApril], features: ['Fonds euros sécurisé', 'Versements libres', 'Frais d\'entrée 0%'] },
    { name: 'Confort', price: '0,6%', badge: 'Frais', logoPool: [logoGenerali, logoSwisslife, logoAllianz, logoCardif], features: ['Fonds euros + unités de compte', 'Gestion pilotée', 'Arbitrages gratuits', 'Avance sur épargne'] },
    { name: 'Premium', price: '0,9%', badge: 'Frais', logoPool: [logoAxa, logoGenerali, logoMetlife, logoAllianz], features: ['Multi-supports premium', 'Gestion sous mandat', 'SCPI accessibles', 'Conseiller dédié'] },
  ]},
  prevoyance: { label: 'Prévoyance', prices: [
    { name: 'Essentielle', price: '11€', badge: 'Dès', logoPool: [logoApril, logoMalakoff, logoAg2r, logoMutuelleGenerale], features: ['Capital décès', 'Rente éducation enfants', 'Frais d\'obsèques'] },
    { name: 'Confort', price: '21€', badge: 'Dès', logoPool: [logoAllianz, logoSwisslife, logoHarmonie, logoApril], features: ['Capital décès', 'Invalidité permanente', 'Indemnités journalières', 'Rente conjoint'] },
    { name: 'Intégrale', price: '37€', badge: 'Dès', logoPool: [logoAxa, logoGenerali, logoMetlife, logoCardif], features: ['Toutes garanties Confort', 'IJ majorées', 'Rente éducation', 'Assistance famille'] },
  ]},
  rc_pro: { label: 'RC Pro', prices: [
    { name: 'Basique', price: '14€', badge: 'Dès', logoPool: [logoAon, logoApril, logoAComme, logoSollyAzar], features: ['RC exploitation', 'RC professionnelle', 'Plafond 1M€'] },
    { name: 'Standard', price: '26€', badge: 'Dès', logoPool: [logoAllianz, logoMma, logoMaaf, logoGenerali], features: ['RC exploitation et pro', 'Défense recours', 'Plafond 3M€', 'Faute inexcusable'] },
    { name: 'Premium', price: '44€', badge: 'Dès', logoPool: [logoAxa, logoAllianz, logoGenerali, logoAbeille], features: ['Toutes garanties Standard', 'Cyber-risques inclus', 'Plafond 8M€', 'Protection juridique étendue'] },
  ]},
  mrp: { label: 'Multirisque Pro', prices: [
    { name: 'Essentielle', price: '26€', badge: 'Dès', logoPool: [logoGenerali, logoMma, logoMaaf, logoAbeille], features: ['Locaux et matériel', 'Incendie, dégâts des eaux', 'RC exploitation'] },
    { name: 'Confort', price: '44€', badge: 'Dès', logoPool: [logoAllianz, logoGroupama, logoMaif, logoMacif], features: ['Tout de l\'Essentielle', 'Vol et vandalisme', 'Bris de machines', 'Perte d\'exploitation'] },
    { name: 'Premium', price: '71€', badge: 'Dès', logoPool: [logoAxa, logoGenerali, logoAllianz, logoAbeille], features: ['Couverture tous risques', 'Cyber-risques', 'Marchandises transportées', 'Protection juridique pro'] },
  ]},
  gli: { label: 'GLI', prices: [
    { name: 'Basique', price: '2,5%', badge: 'Dès', logoPool: [logoAllianz, logoMma, logoMaaf], features: ['Loyers impayés couverts', 'Plafond 50 000€', 'Carence 3 mois'] },
    { name: 'Standard', price: '3%', badge: 'Dès', logoPool: [logoGenerali, logoGroupama, logoAbeille], features: ['Loyers impayés', 'Détériorations immobilières', 'Frais de procédure', 'Carence 2 mois'] },
    { name: 'Premium', price: '3,5%', badge: 'Dès', logoPool: [logoAxa, logoAllianz, logoGenerali], features: ['Toutes garanties Standard', 'Vacance locative', 'Plafond 90 000€', 'Sans carence'] },
  ]},
  pno: { label: 'PNO', prices: [
    { name: 'Essentielle', price: '6€', badge: 'Dès', logoPool: [logoDirectAssurance, logoLuko, logoLolivier, logoAcheel], features: ['Responsabilité civile propriétaire', 'Incendie et dégâts des eaux', 'Recours des locataires'] },
    { name: 'Confort', price: '11€', badge: 'Dès', logoPool: [logoMaif, logoMacif, logoMatmut, logoAbeille], features: ['Tout de l\'Essentielle', 'Vol entre locataires', 'Bris de glace', 'Vacance locative 3 mois'] },
    { name: 'Premium', price: '17€', badge: 'Dès', logoPool: [logoGroupama, logoAxa, logoAllianz, logoGenerali], features: ['Couverture tous risques', 'Vacance locative 6 mois', 'Protection juridique', 'Détériorations immobilières'] },
  ]},
  gestion_locative: { label: 'Gestion Locative', prices: [
    { name: 'Essentielle', price: '5%', badge: 'Dès', logoPool: [logoMaif, logoMacif, logoAbeille], features: ['Encaissement loyers', 'Quittancement', 'Révision annuelle'] },
    { name: 'Confort', price: '7%', badge: 'Dès', logoPool: [logoAllianz, logoMma, logoGenerali], features: ['Tout de l\'Essentielle', 'GLI incluse', 'Gestion technique', 'Visites annuelles'] },
    { name: 'Premium', price: '9%', badge: 'Dès', logoPool: [logoAxa, logoAllianz, logoGroupama], features: ['Gestion complète', 'GLI + vacance', 'Travaux supervisés', 'Reporting détaillé'] },
  ]},
  // Trottinette (décision du 3 octobre 2026) : trois vignettes « Sur devis »,
  // noms identiques aux libellés de l'étape trot_formule. Seul le logo April
  // (contrat d'entrée de gamme mis en avant sur /assurance-trottinette) ; vol,
  // casse et assistance ne sont pas promis chez lui : « selon l'assureur ».
  trottinette: { label: 'Assurance Trottinette', prices: [
    { name: 'Responsabilité civile seule', logoPool: [logoApril], features: ['Responsabilité civile obligatoire (minimum légal)', 'Défense pénale et recours selon le contrat'] },
    { name: 'RC + Vol', logoPool: [logoApril], features: ['Tout de la responsabilité civile', 'Vol : selon l\'assureur (antivol homologué souvent exigé)'] },
    { name: 'Tous risques', logoPool: [logoApril], features: ['Tout de la formule RC + Vol', 'Casse et vandalisme : selon l\'assureur', 'Assistance : selon l\'assureur'] },
  ]},
  velo: { label: 'Assurance Vélo', prices: [
    { name: 'Vol uniquement', price: '3€', badge: 'Dès', logoPool: [logoAcheel, logoLuko, logoLeocare, logoNeo], features: ['Vol avec effraction'] },
    { name: 'Vol + Casse', price: '7€', badge: 'Dès', logoPool: [logoMaif, logoMacif, logoAllianz, logoMaaf], features: ['Vol partout en France', 'Casse + chute'] },
    { name: 'Tous risques + Assistance', price: '11€', badge: 'Dès', logoPool: [logoAxa, logoGenerali, logoGroupama, logoAbeille], features: ['Vol en tous lieux Europe', 'Tous dommages', 'Assistance 0 km'] },
  ]},
  camping_car: { label: 'Camping-car', prices: [
    { name: 'Au tiers', price: '21€', badge: 'Dès', logoPool: [logoMacif, logoMaif, logoMaaf, logoMma], features: ['Responsabilité civile', 'Défense recours'] },
    { name: 'Tiers étendu (vol/incendie)', price: '34€', badge: 'Dès', logoPool: [logoAllianz, logoGroupama, logoMatmut, logoAbeille], features: ['Tout de la formule Au tiers', 'Vol et incendie'] },
    { name: 'Tous risques', price: '54€', badge: 'Dès', logoPool: [logoAxa, logoGenerali, logoGmf, logoAllianz], features: ['Tout de la formule Tiers étendu', 'Tous dommages'] },
  ]},
  sans_permis: { label: 'Voiture sans permis', prices: [
    { name: 'Au tiers (obligatoire)', price: '17€', badge: 'Dès', logoPool: [logoSollyAzar, logoAssu2000, logoAComme, logoAmaguiz], features: ['Responsabilité civile', 'Défense recours'] },
    { name: 'Tiers + vol / incendie', price: '26€', badge: 'Dès', logoPool: [logoMma, logoMaaf, logoMacif, logoAbeille], features: ['Tout de la formule Au tiers', 'Vol et incendie'] },
    { name: 'Tous risques', price: '39€', badge: 'Dès', logoPool: [logoAxa, logoAllianz, logoGroupama, logoGenerali], features: ['Tous dommages', 'Vol et incendie'] },
  ]},
  auto_temporaire: { label: 'Auto temporaire', prices: [
    { name: 'Au tiers', price: '6€', badge: 'Dès', logoPool: [logoWilov, logoOrnikar, logoLeocare, logoGoodflair], features: ['RC obligatoire', 'Défense recours'] },
    { name: 'Tiers étendu', price: '26€', badge: 'Dès', logoPool: [logoLeocare, logoOrnikar, logoWilov, logoLolivier], features: ['Tiers + vol/incendie'] },
    { name: 'Tous risques', price: '67€', badge: 'Dès', logoPool: [logoAllianz, logoAxa, logoMacif, logoLeocare], features: ['Tous dommages au véhicule'] },
  ]},
  flotte: { label: 'Flotte Auto', prices: [
    { name: 'Essentielle', price: '29€', badge: '/véh.', logoPool: [logoMacif, logoMaaf, logoMma, logoMatmut], features: ['Tiers étendu flotte', 'Gestion centralisée', 'Conducteurs interchangeables'] },
    { name: 'Confort', price: '49€', badge: '/véh.', logoPool: [logoAllianz, logoGroupama, logoGenerali, logoAbeille], features: ['Tiers + vol/incendie', 'Bris de glace', 'Assistance Europe'] },
    { name: 'Premium', price: '79€', badge: '/véh.', logoPool: [logoAxa, logoAllianz, logoGenerali, logoMaaf], features: ['Tous risques flotte', 'Bonus mutualisé', 'Véhicule de prêt'] },
  ]},
  cyber: { label: 'Cyber-risques', prices: [
    { name: 'TPE', price: '29€', badge: 'Dès', logoPool: [logoAon, logoApril, logoSollyAzar, logoMma], features: ['Cyber-extorsion', 'Restauration données', 'Plafond 100 K€'] },
    { name: 'PME', price: '67€', badge: 'Dès', logoPool: [logoAllianz, logoMma, logoMaaf, logoGenerali], features: ['Atteintes aux données', 'Frais juridiques RGPD', 'Plafond 500 K€'] },
    { name: 'ETI', price: '119€', badge: 'Dès', logoPool: [logoAxa, logoAllianz, logoGenerali, logoAbeille], features: ['Couverture étendue', 'Cellule de crise 24/7', 'Plafond 2 M€'] },
  ]},
  decennale: { label: 'Décennale', prices: [
    { name: 'Artisan', price: '67€', badge: 'Dès', logoPool: [logoSollyAzar, logoMaaf, logoAssu2000, logoMma], features: ['Couverture 10 ans', 'Activités principales', 'Attestation décennale'] },
    { name: 'Entreprise', price: '112€', badge: 'Dès', logoPool: [logoMma, logoMaaf, logoGenerali, logoAllianz], features: ['Multi-activités', 'Sous-traitance incluse', 'RC pro associée'] },
    { name: 'Premium', price: '172€', badge: 'Dès', logoPool: [logoAxa, logoAllianz, logoGenerali, logoAbeille], features: ['Tous métiers BTP', 'Dommages avant réception', 'Protection juridique'] },
  ]},
  protection_juridique: { label: 'Protection juridique', prices: [
    { name: 'Essentielle', price: '7€', badge: 'Dès', logoPool: [logoMaif, logoMacif, logoMatmut, logoMaaf], features: ['Litiges consommation', 'Voisinage', 'Conseils juridiques'] },
    { name: 'Confort', price: '12€', badge: 'Dès', logoPool: [logoAllianz, logoGroupama, logoMma, logoAbeille], features: ['Vie privée + travail', 'Frais d\'avocat', 'Médiation incluse'] },
    { name: 'Premium (avocat libre choix)', price: '19€', badge: 'Dès', logoPool: [logoAxa, logoGenerali, logoAllianz, logoMaaf], features: ['Tous domaines', 'Plafond 30 000€', 'Avocat libre choix'] },
  ]},
  mutuelle_entreprise: { label: 'Mutuelle entreprise', prices: [
    { name: 'Socle ANI (minimum légal)', price: '17€', badge: '/salarié', logoPool: [logoAlanNew, logoMutuelleGenerale, logoMgen, logoAcheel], features: ['Socle ANI obligatoire', 'Hospitalisation 100% BR', 'Dentaire 125%'] },
    { name: 'Intermédiaire (confort)', price: '29€', badge: '/salarié', logoPool: [logoHarmonie, logoMalakoff, logoAg2r, logoApril], features: ['Socle ANI + renforts', 'Optique 200€/an', 'Médecines douces'] },
    { name: 'Premium (optique/dentaire renforcés)', price: '49€', badge: '/salarié', logoPool: [logoAxa, logoAllianz, logoGenerali, logoMetlife], features: ['Couverture étendue', 'Dentaire 400%'] },
  ]},
};
