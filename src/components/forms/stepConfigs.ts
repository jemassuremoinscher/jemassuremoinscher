import { Shield, ShieldCheck, ShieldPlus, Heart, HeartPulse, Activity, Home, Building, Castle, Car, Bike, PawPrint, Briefcase, FileText, Wallet, Landmark, Baby, Users, User, Stethoscope, Pill, Eye, Search, Lock, Scale, Umbrella, ChevronRight, TreePine, Mountain, PartyPopper, HardHat, Award, AlertTriangle, Calendar, Building2, Sparkles, KeyRound, Zap, Truck, Hammer, Clock, Globe, Database } from 'lucide-react';
import mascotBike from '@/assets/mascotte/arthur-bike.png';
import mascotScoot from '@/assets/mascotte/arthur-scoot.png?w=480&format=webp';
import mascotCar from '@/assets/mascotte/arthur-car.webp?w=480&format=webp';
import mascotMoto from '@/assets/mascotte/arthur-moto.webp?w=480&format=webp';
import mascotHouse from '@/assets/mascotte/arthur-house.webp?w=480&format=webp';
import mascotSick from '@/assets/mascotte/arthur-sick.webp';
import mascotThinking from '@/assets/mascotte/arthur-thinking.webp';
import mascotAnimals from '@/assets/mascotte/arthur-animals.webp';
import mascotIdea from '@/assets/mascotte/arthur-idea.webp';
import mascotInjured from '@/assets/mascotte/arthur-injured.webp';
import mascotBusiness from '@/assets/mascotte/arthur-business.webp';
import mascotDetective from '@/assets/mascotte/arthur-detective.webp';
import mascotThumbsUp from '@/assets/mascotte/arthur-thumbs-up.webp';

export interface StepOption {
  value: string;
  label: string;
  description?: string;
  icon: any;
  /** Optional mascot image rendered in place of the flat icon */
  iconImage?: string;
}

export interface FormStep {
  id: string;
  type: 'card-select' | 'input' | 'searching' | 'contact' | 'vehicle-select' | 'callback';
  title: string;
  subtitle?: string;
  field?: string;
  options?: StepOption[];
  inputType?: string;
  placeholder?: string;
  maxLength?: number;
  validation?: RegExp;
  validationMessage?: string;
  vehicleType?: 'auto' | 'moto';
  vehicleField?: 'brand' | 'model' | 'year';
  /** Affiche un bouton secondaire "Je ne sais pas / Estimer pour moi" qui pré-remplit
   * une valeur par défaut et avance sans bloquer l'utilisateur sur ce champ. */
  showUnsureButton?: boolean;
  /** Valeur pré-sélectionnée par ce bouton (étapes card-select). Ignoré pour les étapes
   * vehicle-select, qui calculent leur valeur par défaut dynamiquement (marque déjà choisie). */
  unsureDefaultValue?: string;
  /** Courte explication d'Arthur sur l'utilite de cette question pour le tarif. */
  arthurHint?: string;
}

export type InsuranceType = 'auto' | 'moto' | 'habitation' | 'sante' | 'pret' | 'animaux' | 'vie' | 'prevoyance' | 'rc_pro' | 'mrp' | 'gli' | 'pno' | 'comparateur' | 'metiers_atypiques' | 'gestion_locative' | 'velo' | 'trottinette' | 'camping_car' | 'sans_permis' | 'auto_temporaire' | 'flotte' | 'cyber' | 'decennale' | 'protection_juridique' | 'mutuelle_entreprise';

export const mascotMap: Record<InsuranceType, string> = {
  auto: mascotCar,
  moto: mascotMoto,
  habitation: mascotHouse,
  sante: mascotSick,
  pret: mascotThinking,
  animaux: mascotAnimals,
  vie: mascotIdea,
  prevoyance: mascotInjured,
  rc_pro: mascotBusiness,
  mrp: mascotBusiness,
  gli: mascotDetective,
  pno: mascotHouse,
  comparateur: mascotThumbsUp,
  metiers_atypiques: mascotBusiness,
  gestion_locative: mascotHouse,
  velo: mascotBike,
  trottinette: mascotScoot,
  camping_car: mascotCar,
  sans_permis: mascotCar,
  auto_temporaire: mascotCar,
  flotte: mascotBusiness,
  cyber: mascotDetective,
  decennale: mascotBusiness,
  protection_juridique: mascotIdea,
  mutuelle_entreprise: mascotBusiness,
};


type TFn = (key: string, vars?: Record<string, string | number>) => string;

// Helper to build option from i18n keys
const opt = (t: TFn, it: string, sid: string, value: string, icon: any, iconImage?: string): StepOption => {
  const base = `step.${it}.${sid}.opt.${value}`;
  const descKey = `${base}.description`;
  const desc = t(descKey);
  return {
    value,
    label: t(`${base}.label`),
    description: desc === descKey ? undefined : desc,
    icon,
    iconImage,
  };
};

const tt = (t: TFn, it: string, sid: string, prop: string): string | undefined => {
  const k = `step.${it}.${sid}.${prop}`;
  const v = t(k);
  return v === k ? undefined : v;
};

export const buildStepConfigs = (t: TFn): Record<InsuranceType, FormStep[]> => {
  const searchingStep: FormStep = {
    id: 'searching',
    type: 'searching',
    title: t('step.shared.searching.title'),
    subtitle: t('step.shared.searching.subtitle'),
  };

  const contactStep: FormStep = {
    id: 'contact',
    type: 'contact',
    title: t('step.shared.contact.title'),
    subtitle: t('step.shared.contact.subtitle'),
  };

  const postalCodeStep: FormStep = {
    id: 'postalCode',
    type: 'input',
    title: t('step.shared.postalCode.title'),
    subtitle: t('step.shared.postalCode.subtitle'),
    field: 'postalCode',
    arthurHint: 'Le code postal affine le tarif selon les risques de votre zone (vol, sinistralité locale).',
    inputType: 'text',
    placeholder: t('step.shared.postalCode.placeholder'),
    maxLength: 5,
    validation: /^\d{5}$/,
    validationMessage: t('step.shared.postalCode.validation'),
  };

  const ageStep: FormStep = {
    id: 'age',
    type: 'input',
    title: t('step.shared.age.title'),
    subtitle: t('step.shared.age.subtitle'),
    field: 'age',
    arthurHint: "L'âge influence fortement le calcul du tarif.",
    inputType: 'number',
    placeholder: t('step.shared.age.placeholder'),
    validation: /^(1[89]|[2-9]\d)$/,
    validationMessage: t('step.shared.age.validation'),
  };

  const vehicleBrandStepAuto: FormStep = {
    id: 'vehicleBrand',
    type: 'vehicle-select',
    title: t('step.shared.vehicleBrandAuto.title'),
    subtitle: t('step.shared.vehicleBrandAuto.subtitle'),
    field: 'vehicleBrand',
    vehicleType: 'auto',
    vehicleField: 'brand',
    arthurHint: 'La marque du véhicule influence le coût des réparations et donc le tarif.',
  };

  const vehicleModelStepAuto: FormStep = {
    id: 'vehicleModel',
    type: 'vehicle-select',
    title: t('step.shared.vehicleModel.title'),
    subtitle: t('step.shared.vehicleModel.subtitle'),
    field: 'vehicleModel',
    vehicleType: 'auto',
    vehicleField: 'model',
    arthurHint: 'Le modèle influence directement le tarif.',
    showUnsureButton: true,
  };

  const vehicleYearStep: FormStep = {
    id: 'vehicleYear',
    type: 'input',
    title: t('step.shared.vehicleYear.title'),
    subtitle: t('step.shared.vehicleYear.subtitle'),
    field: 'vehicleYear',
    arthurHint: "L'année du véhicule joue sur sa valeur et le coût de remplacement en cas de sinistre.",
    inputType: 'number',
    placeholder: t('step.shared.vehicleYear.placeholder'),
    validation: /^(19[89]\d|20[0-2]\d|203[0-6])$/,
    validationMessage: t('step.shared.vehicleYear.validation'),
  };

  const vehicleBrandStepMoto: FormStep = {
    id: 'vehicleBrand',
    type: 'vehicle-select',
    title: t('step.shared.vehicleBrandMoto.title'),
    subtitle: t('step.shared.vehicleBrandMoto.subtitle'),
    field: 'vehicleBrand',
    vehicleType: 'moto',
    vehicleField: 'brand',
    arthurHint: 'La marque du véhicule influence le coût des réparations et donc le tarif.',
  };

  const vehicleModelStepMoto: FormStep = {
    id: 'vehicleModel',
    type: 'vehicle-select',
    title: t('step.shared.vehicleModel.title'),
    subtitle: t('step.shared.vehicleModel.subtitle'),
    field: 'vehicleModel',
    vehicleType: 'moto',
    vehicleField: 'model',
    arthurHint: 'Le modèle influence directement le tarif.',
    showUnsureButton: true,
  };

  const cs = (it: InsuranceType, sid: string, field: string, opts: StepOption[], arthurHint?: string): FormStep => ({
    id: sid,
    type: 'card-select',
    title: t(`step.${it}.${sid}.title`),
    subtitle: tt(t, it, sid, 'subtitle'),
    field,
    options: opts,
    arthurHint,
  });

  return {
    auto: [
      cs('auto', 'formule', 'coverageLevel', [
        opt(t, 'auto', 'formule', 'tiers', Shield),
        opt(t, 'auto', 'formule', 'tiers_plus', ShieldCheck),
        opt(t, 'auto', 'formule', 'tous_risques', ShieldPlus),
      ], 'Le niveau de garantie est le principal levier du prix : tiers, tiers étendu ou tous risques.'),
      vehicleBrandStepAuto,
      vehicleModelStepAuto,
      vehicleYearStep,
      cs('auto', 'usage_auto', 'vehicleUse', [
        opt(t, 'auto', 'usage_auto', 'prive', User),
        opt(t, 'auto', 'usage_auto', 'trajet_travail', Briefcase),
        opt(t, 'auto', 'usage_auto', 'pro', Building2),
      ], 'Un usage professionnel augmente l\'exposition au risque, donc le tarif.'),
      {
        ...cs('auto', 'bonus_malus_auto', 'bonusMalus', [
          opt(t, 'auto', 'bonus_malus_auto', 'bonus_050', Award),
          opt(t, 'auto', 'bonus_malus_auto', 'standard', ShieldCheck),
          opt(t, 'auto', 'bonus_malus_auto', 'malus', AlertTriangle),
        ], 'Même approximatif, ça affine fortement le tarif.'),
        showUnsureButton: true,
        unsureDefaultValue: 'standard',
      },
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    moto: [
      cs('moto', 'formule', 'coverageLevel', [
        opt(t, 'moto', 'formule', 'tiers', Shield),
        opt(t, 'moto', 'formule', 'tiers_plus', ShieldCheck),
        opt(t, 'moto', 'formule', 'tous_risques', ShieldPlus),
      ], 'Le niveau de garantie est le principal levier du prix de l\'assurance moto.'),
      vehicleBrandStepMoto,
      vehicleModelStepMoto,
      vehicleYearStep,
      cs('moto', 'cylindree_moto', 'engineSize', [
        opt(t, 'moto', 'cylindree_moto', '125', Bike),
        opt(t, 'moto', 'cylindree_moto', 'medium', Bike),
        opt(t, 'moto', 'cylindree_moto', 'large', AlertTriangle),
      ], 'La cylindrée est un facteur clé du tarif : plus elle est élevée, plus le risque augmente.'),
      cs('moto', 'stationnement_moto', 'parkingType', [
        opt(t, 'moto', 'stationnement_moto', 'garage', Lock),
        opt(t, 'moto', 'stationnement_moto', 'parking', Building),
        opt(t, 'moto', 'stationnement_moto', 'rue', AlertTriangle),
      ], 'Un stationnement sécurisé réduit le risque de vol et peut faire baisser le tarif.'),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    habitation: [
      cs('habitation', 'logement', 'housingType', [
        opt(t, 'habitation', 'logement', 'appartement', Building),
        opt(t, 'habitation', 'logement', 'maison', Home),
        opt(t, 'habitation', 'logement', 'villa', Castle),
      ], 'Le type de logement (appartement, maison, villa) influence le niveau de risque assuré.'),
      cs('habitation', 'formule', 'coverageLevel', [
        opt(t, 'habitation', 'formule', 'essentielle', Shield),
        opt(t, 'habitation', 'formule', 'confort', ShieldCheck),
        opt(t, 'habitation', 'formule', 'premium', ShieldPlus),
      ], 'Le niveau de garantie détermine ce qui est couvert et le tarif associé.'),
      cs('habitation', 'surface_logement', 'housingSurface', [
        opt(t, 'habitation', 'surface_logement', 'sub_40', Home),
        opt(t, 'habitation', 'surface_logement', '40_90', Building),
        opt(t, 'habitation', 'surface_logement', 'sup_90', Castle),
      ], 'La surface du logement est un critère direct du calcul de la prime.'),
      cs('habitation', 'statut_occupant', 'occupancyStatus', [
        opt(t, 'habitation', 'statut_occupant', 'locataire', KeyRound),
        opt(t, 'habitation', 'statut_occupant', 'proprietaire', Home),
        opt(t, 'habitation', 'statut_occupant', 'coproprietaire', Building2),
      ], 'Être locataire ou propriétaire change les garanties obligatoires et donc le tarif.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    sante: [
      cs('sante', 'situation', 'situation', [
        opt(t, 'sante', 'situation', 'seul', User),
        opt(t, 'sante', 'situation', 'couple', Users),
        opt(t, 'sante', 'situation', 'famille', Baby),
      ], 'Le nombre de personnes à couvrir (seul, couple, famille) détermine le tarif global.'),
      cs('sante', 'besoins', 'coverageLevel', [
        opt(t, 'sante', 'besoins', 'economique', Stethoscope),
        opt(t, 'sante', 'besoins', 'equilibre', Eye),
        opt(t, 'sante', 'besoins', 'integrale', HeartPulse),
      ], 'Le niveau de remboursement souhaité est le principal levier du tarif de mutuelle.'),
      cs('sante', 'hospitalisation_sante', 'hospitalCoverage', [
        opt(t, 'sante', 'hospitalisation_sante', 'standard', Stethoscope),
        opt(t, 'sante', 'hospitalisation_sante', 'renforce', ShieldCheck),
        opt(t, 'sante', 'hospitalisation_sante', 'premium', HeartPulse),
      ], 'Le niveau de couverture hospitalisation pèse fortement sur le prix de la mutuelle.'),
      cs('sante', 'optique_dentaire', 'opticalDentalNeeds', [
        opt(t, 'sante', 'optique_dentaire', 'faibles', Eye),
        opt(t, 'sante', 'optique_dentaire', 'reguliers', Pill),
        opt(t, 'sante', 'optique_dentaire', 'forts', HeartPulse),
      ], 'Vos besoins en optique et dentaire orientent vers la formule la plus adaptée.'),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    pret: [
      cs('pret', 'garanties', 'coverageLevel', [
        opt(t, 'pret', 'garanties', 'deces', Shield),
        opt(t, 'pret', 'garanties', 'deces_ipt', ShieldCheck),
        opt(t, 'pret', 'garanties', 'deces_ipt_itt', ShieldPlus),
      ], 'Le niveau de garanties (décès, IPT, ITT) est le principal facteur du tarif.'),
      cs('pret', 'montant_pret', 'loanAmount', [
        opt(t, 'pret', 'montant_pret', 'sub_150k', Wallet),
        opt(t, 'pret', 'montant_pret', '150_300k', Landmark),
        opt(t, 'pret', 'montant_pret', 'sup_300k', Building2),
      ], 'Le montant emprunté détermine directement le capital à assurer.'),
      cs('pret', 'fumeur_pret', 'smokerStatus', [
        opt(t, 'pret', 'fumeur_pret', 'non', ShieldCheck),
        opt(t, 'pret', 'fumeur_pret', 'ex', Activity),
        opt(t, 'pret', 'fumeur_pret', 'oui', AlertTriangle),
      ], 'Le statut fumeur est un critère médical qui influence fortement le tarif.'),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    animaux: [
      cs('animaux', 'animal', 'animalType', [
        opt(t, 'animaux', 'animal', 'chien', PawPrint),
        opt(t, 'animaux', 'animal', 'chat', PawPrint),
        opt(t, 'animaux', 'animal', 'nac', PawPrint),
      ], 'L\'espèce de l\'animal (chien, chat, NAC) conditionne les garanties disponibles.'),
      cs('animaux', 'formule', 'coverageLevel', [
        opt(t, 'animaux', 'formule', 'accident', Activity),
        opt(t, 'animaux', 'formule', 'maladie_accident', HeartPulse),
        opt(t, 'animaux', 'formule', 'integrale', Heart),
      ], 'Le niveau de garantie choisi détermine les frais vétérinaires remboursés.'),
      cs('animaux', 'age_animal', 'petAge', [
        opt(t, 'animaux', 'age_animal', 'junior', PawPrint),
        opt(t, 'animaux', 'age_animal', 'adult', PawPrint),
        opt(t, 'animaux', 'age_animal', 'senior', HeartPulse),
      ], 'L\'âge de l\'animal influence son risque de santé et donc le tarif.'),
      cs('animaux', 'race_animal', 'petRisk', [
        opt(t, 'animaux', 'race_animal', 'standard', ShieldCheck),
        opt(t, 'animaux', 'race_animal', 'race_sensible', AlertTriangle),
        opt(t, 'animaux', 'race_animal', 'antecedents', Stethoscope),
      ], 'Certaines races sont plus sujettes à des pathologies, ce qui impacte le tarif.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    vie: [
      cs('vie', 'objectif', 'coverageLevel', [
        opt(t, 'vie', 'objectif', 'epargne', Wallet),
        opt(t, 'vie', 'objectif', 'protection', Umbrella),
        opt(t, 'vie', 'objectif', 'mixte', Landmark),
      ], 'Votre objectif (épargne, protection, mixte) oriente le contrat le plus adapté.'),
      cs('vie', 'versement_initial', 'initialPayment', [
        opt(t, 'vie', 'versement_initial', 'sub_5k', Wallet),
        opt(t, 'vie', 'versement_initial', '5_50k', Landmark),
        opt(t, 'vie', 'versement_initial', 'sup_50k', Award),
      ], 'Le montant du versement initial peut influencer les frais et options disponibles.'),
      cs('vie', 'horizon_vie', 'investmentHorizon', [
        opt(t, 'vie', 'horizon_vie', 'sub_4', Calendar),
        opt(t, 'vie', 'horizon_vie', '4_8', ShieldCheck),
        opt(t, 'vie', 'horizon_vie', 'sup_8', Sparkles),
      ], 'L\'horizon de placement aide à choisir un profil de risque adapté.'),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    prevoyance: [
      cs('prevoyance', 'formule', 'coverageLevel', [
        opt(t, 'prevoyance', 'formule', 'essentielle', Shield),
        opt(t, 'prevoyance', 'formule', 'confort', ShieldCheck),
        opt(t, 'prevoyance', 'formule', 'integrale', ShieldPlus),
      ], 'Le niveau de garanties détermine l\'étendue de la protection en cas de coup dur.'),
      cs('prevoyance', 'statut_prevoyance', 'professionalStatus', [
        opt(t, 'prevoyance', 'statut_prevoyance', 'salarie', Briefcase),
        opt(t, 'prevoyance', 'statut_prevoyance', 'tns', User),
        opt(t, 'prevoyance', 'statut_prevoyance', 'dirigeant', Building2),
      ], 'Le statut professionnel (salarié, TNS, dirigeant) change les besoins de couverture.'),
      cs('prevoyance', 'revenu_prevoyance', 'incomeToProtect', [
        opt(t, 'prevoyance', 'revenu_prevoyance', 'sub_2k', Wallet),
        opt(t, 'prevoyance', 'revenu_prevoyance', '2_4k', ShieldCheck),
        opt(t, 'prevoyance', 'revenu_prevoyance', 'sup_4k', Award),
      ], 'Le revenu à protéger détermine le montant des indemnités journalières.'),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    rc_pro: [
      cs('rc_pro', 'activite', 'activityType', [
        opt(t, 'rc_pro', 'activite', 'liberal', Briefcase),
        opt(t, 'rc_pro', 'activite', 'commerce', Scale),
        opt(t, 'rc_pro', 'activite', 'tech', FileText),
      ], 'Le secteur d\'activité détermine les risques couverts par la RC Pro.'),
      cs('rc_pro', 'formule', 'coverageLevel', [
        opt(t, 'rc_pro', 'formule', 'basique', Shield),
        opt(t, 'rc_pro', 'formule', 'standard', ShieldCheck),
        opt(t, 'rc_pro', 'formule', 'premium', ShieldPlus),
      ], 'Le niveau de garantie fixe le plafond d\'indemnisation en cas de litige.'),
      cs('rc_pro', 'ca_rcpro', 'revenue', [
        opt(t, 'rc_pro', 'ca_rcpro', 'sub_50k', Wallet),
        opt(t, 'rc_pro', 'ca_rcpro', '50_250k', Briefcase),
        opt(t, 'rc_pro', 'ca_rcpro', 'sup_250k', Building2),
      ], 'Le chiffre d\'affaires est un critère clé du calcul de la prime RC Pro.'),
      cs('rc_pro', 'clients_rcpro', 'clientType', [
        opt(t, 'rc_pro', 'clients_rcpro', 'particuliers', Users),
        opt(t, 'rc_pro', 'clients_rcpro', 'entreprises', Building2),
        opt(t, 'rc_pro', 'clients_rcpro', 'mixte', Scale),
      ], 'Le type de clientèle (particuliers, entreprises) influence le niveau de risque.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    mrp: [
      cs('mrp', 'formule', 'coverageLevel', [
        opt(t, 'mrp', 'formule', 'essentielle', Shield),
        opt(t, 'mrp', 'formule', 'confort', ShieldCheck),
        opt(t, 'mrp', 'formule', 'premium', ShieldPlus),
      ], 'Le niveau de garantie détermine la protection de vos locaux professionnels.'),
      cs('mrp', 'local_mrp', 'businessPremises', [
        opt(t, 'mrp', 'local_mrp', 'bureau', Building),
        opt(t, 'mrp', 'local_mrp', 'commerce', Briefcase),
        opt(t, 'mrp', 'local_mrp', 'atelier', HardHat),
      ], 'Le type de local (bureau, commerce, atelier) influence le risque assuré.'),
      cs('mrp', 'stock_mrp', 'equipmentValue', [
        opt(t, 'mrp', 'stock_mrp', 'sub_10k', Shield),
        opt(t, 'mrp', 'stock_mrp', '10_50k', ShieldCheck),
        opt(t, 'mrp', 'stock_mrp', 'sup_50k', ShieldPlus),
      ], 'La valeur du matériel et du stock détermine le capital à assurer.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    gli: [
      cs('gli', 'formule', 'coverageLevel', [
        opt(t, 'gli', 'formule', 'basique', Shield),
        opt(t, 'gli', 'formule', 'standard', ShieldCheck),
        opt(t, 'gli', 'formule', 'premium', ShieldPlus),
      ], 'Le niveau de garantie fixe le plafond de loyers impayés couverts.'),
      cs('gli', 'loyer_gli', 'monthlyRent', [
        opt(t, 'gli', 'loyer_gli', 'sub_700', Wallet),
        opt(t, 'gli', 'loyer_gli', '700_1500', Home),
        opt(t, 'gli', 'loyer_gli', 'sup_1500', Building2),
      ], 'Le montant du loyer détermine directement le tarif de la garantie.'),
      cs('gli', 'locataire_gli', 'tenantStatus', [
        opt(t, 'gli', 'locataire_gli', 'nouveau', Search),
        opt(t, 'gli', 'locataire_gli', 'en_place_ok', ShieldCheck),
        opt(t, 'gli', 'locataire_gli', 'incident', AlertTriangle),
      ], 'Le profil du locataire (nouveau, en place, incident) est central dans l\'évaluation du risque.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    pno: [
      cs('pno', 'formule', 'coverageLevel', [
        opt(t, 'pno', 'formule', 'essentielle', Shield),
        opt(t, 'pno', 'formule', 'confort', ShieldCheck),
        opt(t, 'pno', 'formule', 'premium', ShieldPlus),
      ], 'Le niveau de garantie détermine la protection de votre bien loué.'),
      cs('pno', 'occupation_pno', 'propertyOccupancy', [
        opt(t, 'pno', 'occupation_pno', 'loue', KeyRound),
        opt(t, 'pno', 'occupation_pno', 'vacant', Home),
        opt(t, 'pno', 'occupation_pno', 'travaux', HardHat),
      ], 'L\'occupation du bien (loué, vacant, travaux) change le niveau de risque.'),
      cs('pno', 'type_bien_pno', 'propertyType', [
        opt(t, 'pno', 'type_bien_pno', 'appartement', Building),
        opt(t, 'pno', 'type_bien_pno', 'maison', Home),
        opt(t, 'pno', 'type_bien_pno', 'immeuble', Building2),
      ], 'Le type de bien (appartement, maison, immeuble) influence le tarif.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    gestion_locative: [
      cs('gestion_locative', 'propertyCount', 'propertyCount', [
        opt(t, 'gestion_locative', 'propertyCount', '1', Home),
        opt(t, 'gestion_locative', 'propertyCount', '2-5', Building),
        opt(t, 'gestion_locative', 'propertyCount', '5+', Building2),
      ], 'Le nombre de biens à gérer détermine l\'ampleur du service et son tarif.'),
      cs('gestion_locative', 'managementType', 'managementType', [
        opt(t, 'gestion_locative', 'managementType', 'full', ShieldPlus),
        opt(t, 'gestion_locative', 'managementType', 'partial', ShieldCheck),
        opt(t, 'gestion_locative', 'managementType', 'declaration', FileText),
      ], 'Le niveau de gestion souhaité (complète, partielle) fixe l\'étendue des prestations.'),
      cs('gestion_locative', 'rentCollection', 'rentCollection', [
        opt(t, 'gestion_locative', 'rentCollection', 'oui', Wallet),
        opt(t, 'gestion_locative', 'rentCollection', 'non', User),
        opt(t, 'gestion_locative', 'rentCollection', 'a_decider', Search),
      ], 'L\'encaissement des loyers est une prestation clé qui influence le tarif.'),
      cs('gestion_locative', 'gli_included', 'includeGLI', [
        opt(t, 'gestion_locative', 'gli_included', 'oui', Lock),
        opt(t, 'gestion_locative', 'gli_included', 'non', FileText),
        opt(t, 'gestion_locative', 'gli_included', 'comparer', Scale),
      ], 'Inclure la garantie loyers impayés change le niveau de protection et le prix.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    comparateur: [
      cs('comparateur', 'type', 'insuranceType', [
        opt(t, 'comparateur', 'type', 'auto', Car, mascotCar),
        opt(t, 'comparateur', 'type', 'moto', Bike, mascotMoto),
        opt(t, 'comparateur', 'type', 'habitation', Home, mascotHouse),
        opt(t, 'comparateur', 'type', 'trottinette', Zap, mascotScoot),
        opt(t, 'comparateur', 'type', 'sante', Heart, mascotSick),
        opt(t, 'comparateur', 'type', 'pno', Building, mascotHouse),
        opt(t, 'comparateur', 'type', 'gli', Lock, mascotDetective),
        opt(t, 'comparateur', 'type', 'vie', Landmark, mascotIdea),
        opt(t, 'comparateur', 'type', 'rc_pro', Briefcase, mascotBusiness),
        opt(t, 'comparateur', 'type', 'prevoyance', Umbrella, mascotInjured),
        opt(t, 'comparateur', 'type', 'pret', FileText, mascotThinking),
        opt(t, 'comparateur', 'type', 'mrp', Building2, mascotBusiness),
        opt(t, 'comparateur', 'type', 'gestion_locative', KeyRound, mascotHouse),
      ], 'Le type d\'assurance choisi détermine le parcours et les critères suivants.'),
      cs('comparateur', 'formule', 'coverageLevel', [
        opt(t, 'comparateur', 'formule', 'essentielle', Shield),
        opt(t, 'comparateur', 'formule', 'confort', ShieldCheck),
        opt(t, 'comparateur', 'formule', 'premium', ShieldPlus),
      ], 'Le niveau de garantie recherché aide à cibler les meilleures offres.'),
      postalCodeStep, searchingStep, contactStep,
    ],
    metiers_atypiques: [
      cs('metiers_atypiques', 'famille_activite', 'activityFamily', [
        opt(t, 'metiers_atypiques', 'famille_activite', 'parc_aventure', TreePine),
        opt(t, 'metiers_atypiques', 'famille_activite', 'sport_outdoor', Mountain),
        opt(t, 'metiers_atypiques', 'famille_activite', 'evenementiel', PartyPopper),
        opt(t, 'metiers_atypiques', 'famille_activite', 'btp_specialise', HardHat),
        opt(t, 'metiers_atypiques', 'famille_activite', 'autre', Sparkles),
      ], 'La famille d\'activité détermine les garanties spécifiques nécessaires.'),
      {
        id: 'description_activite',
        type: 'input',
        title: t('step.metiers_atypiques.description_activite.title'),
        subtitle: t('step.metiers_atypiques.description_activite.subtitle'),
        field: 'activityDescription',
        arthurHint: 'Une description précise permet d\'évaluer correctement le risque de votre activité.',
        inputType: 'text',
        placeholder: t('step.metiers_atypiques.description_activite.placeholder'),
        maxLength: 120,
        validation: /^.{10,120}$/,
        validationMessage: t('step.metiers_atypiques.description_activite.validation'),
      },
      cs('metiers_atypiques', 'statut', 'legalStatus', [
        opt(t, 'metiers_atypiques', 'statut', 'micro', User),
        opt(t, 'metiers_atypiques', 'statut', 'sasu_eurl', Briefcase),
        opt(t, 'metiers_atypiques', 'statut', 'sas_sarl', Building2),
        opt(t, 'metiers_atypiques', 'statut', 'asso', Users),
      ], 'Le statut juridique influence les responsabilités et garanties à couvrir.'),
      cs('metiers_atypiques', 'public_encadre', 'publicExposure', [
        opt(t, 'metiers_atypiques', 'public_encadre', 'aucun', Lock),
        opt(t, 'metiers_atypiques', 'public_encadre', 'adultes', User),
        opt(t, 'metiers_atypiques', 'public_encadre', 'mixte', Users),
        opt(t, 'metiers_atypiques', 'public_encadre', 'mineurs', Baby),
      ], 'Le public encadré (mineurs, adultes) est un facteur clé du niveau de risque.'),
      cs('metiers_atypiques', 'frequentation', 'attendance', [
        opt(t, 'metiers_atypiques', 'frequentation', 'sub_500', Calendar),
        opt(t, 'metiers_atypiques', 'frequentation', '500_5k', Users),
        opt(t, 'metiers_atypiques', 'frequentation', '5k_50k', Users),
        opt(t, 'metiers_atypiques', 'frequentation', 'sup_50k', PartyPopper),
      ], 'La fréquentation impacte directement l\'exposition au risque.'),
      cs('metiers_atypiques', 'salaries', 'staffSize', [
        opt(t, 'metiers_atypiques', 'salaries', 'solo', User),
        opt(t, 'metiers_atypiques', 'salaries', '2_5', Users),
        opt(t, 'metiers_atypiques', 'salaries', '6_20', Users),
        opt(t, 'metiers_atypiques', 'salaries', 'sup_20', Building2),
      ], 'Le nombre de salariés influence les garanties responsabilité civile nécessaires.'),
      cs('metiers_atypiques', 'ca', 'revenue', [
        opt(t, 'metiers_atypiques', 'ca', 'sub_50k', Wallet),
        opt(t, 'metiers_atypiques', 'ca', '50_200k', Wallet),
        opt(t, 'metiers_atypiques', 'ca', '200k_1m', Wallet),
        opt(t, 'metiers_atypiques', 'ca', 'sup_1m', Wallet),
      ], 'Le chiffre d\'affaires est un critère central du calcul de la prime.'),
      cs('metiers_atypiques', 'certifications', 'certifications', [
        opt(t, 'metiers_atypiques', 'certifications', 'oui_majeures', Award),
        opt(t, 'metiers_atypiques', 'certifications', 'oui_partielles', ShieldCheck),
        opt(t, 'metiers_atypiques', 'certifications', 'non', AlertTriangle),
        opt(t, 'metiers_atypiques', 'certifications', 'en_cours', Activity),
      ], 'Les certifications peuvent réduire le risque perçu et donc le tarif.'),
      cs('metiers_atypiques', 'sinistres', 'claimsHistory', [
        opt(t, 'metiers_atypiques', 'sinistres', 'aucun', ShieldCheck),
        opt(t, 'metiers_atypiques', 'sinistres', '1_2', Shield),
        opt(t, 'metiers_atypiques', 'sinistres', '3_5', AlertTriangle),
        opt(t, 'metiers_atypiques', 'sinistres', 'sup_5', AlertTriangle),
      ], 'L\'historique de sinistres est l\'un des facteurs les plus déterminants du tarif.'),
      postalCodeStep,
      {
        id: 'callback',
        type: 'callback',
        title: t('step.metiers_atypiques.callback.title'),
        subtitle: t('step.metiers_atypiques.callback.subtitle'),
      },
    ],
    // ============ NICHES (inline FR, no i18n keys) ============
    velo: [
      { id: 'velo_type', type: 'card-select', title: 'Quel type de vélo souhaitez-vous assurer ?', field: 'bikeType', arthurHint: 'Le type de vélo détermine le niveau de risque et les garanties adaptées.', options: [
        { value: 'musculaire', label: 'Vélo musculaire', description: 'Ville, route, VTT classique', icon: Bike },
        { value: 'vae', label: 'Vélo à assistance électrique (VAE)', description: 'Pédalage assisté ≤ 25 km/h', icon: Zap },
        { value: 'cargo', label: 'Vélo cargo / pliant / speed-bike', description: 'Usage spécifique ou > 25 km/h', icon: Truck },
      ]},
      { id: 'velo_valeur', type: 'card-select', title: 'Quelle est la valeur de votre vélo ?', field: 'bikeValue', arthurHint: 'La valeur du vélo fixe le plafond d\'indemnisation en cas de vol ou casse.', options: [
        { value: 'sub_800', label: 'Moins de 800 €', icon: Wallet },
        { value: '800_2500', label: 'Entre 800 € et 2 500 €', icon: Shield },
        { value: 'sup_2500', label: 'Plus de 2 500 €', icon: ShieldPlus },
      ]},
      { id: 'velo_formule', type: 'card-select', title: 'Quelles garanties recherchez-vous ?', field: 'coverageLevel', arthurHint: 'Le niveau de garantie choisi définit ce qui est couvert (vol, casse, tous risques).', options: [
        { value: 'vol', label: 'Vol uniquement', description: 'Protection antivol agréé', icon: Lock },
        { value: 'vol_casse', label: 'Vol + Casse', description: 'Couverture étendue', icon: ShieldCheck },
        { value: 'tous_risques', label: 'Tous risques + Assistance', description: 'Protection maximale', icon: ShieldPlus },
      ]},
      { id: 'velo_stationnement', type: 'card-select', title: 'Où stationnez-vous votre vélo ?', field: 'parkingType', arthurHint: 'Le lieu de stationnement influence directement le risque de vol.', options: [
        { value: 'garage', label: 'Garage / local fermé', icon: Lock },
        { value: 'local_velo', label: 'Local vélo / cave', icon: Building },
        { value: 'exterieur', label: 'Rue / extérieur', icon: AlertTriangle },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    trottinette: [
      { id: 'trot_engin', type: 'card-select', title: 'Quel engin souhaitez-vous assurer ?', subtitle: 'Tout EDPM doit être couvert en responsabilité civile depuis 2019.', field: 'vehicleSubtype', arthurHint: 'Le type d\'engin détermine les garanties légalement exigées.', options: [
        { value: 'trottinette', label: 'Trottinette électrique', description: 'Bridée à 25 km/h (EDPM)', icon: Zap, iconImage: mascotScoot },
        { value: 'trottinette_debridee', label: 'Trottinette > 25 km/h', description: 'Engin non homologué EDPM', icon: AlertTriangle },
        { value: 'gyroroue', label: 'Gyroroue / hoverboard / monoroue', description: 'Autre EDPM motorisé', icon: Activity },
      ]},
      { id: 'trot_usage', type: 'card-select', title: "Quel est l'usage de votre trottinette ?", field: 'vehicleUse', arthurHint: 'Un usage professionnel (livraison) implique un risque et une formule différents.', options: [
        { value: 'perso', label: 'Usage personnel / loisirs', description: 'Balades, trajets occasionnels', icon: Zap },
        { value: 'domicile_travail', label: 'Trajets domicile-travail', description: 'Usage quotidien urbain', icon: Activity },
        { value: 'livreur', label: 'Livraison (Uber Eats, Deliveroo…)', description: 'Usage commercial : formule pro requise', icon: Truck },
      ]},
      { id: 'trot_valeur', type: 'card-select', title: 'Quelle est la valeur de votre trottinette ?', subtitle: 'Elle détermine le niveau des garanties vol et casse.', field: 'bikeValue', arthurHint: 'Cette valeur fixe le plafond d\'indemnisation en cas de sinistre.', options: [
        { value: 'sub_500', label: 'Moins de 500 €', icon: Wallet },
        { value: '500_1500', label: 'Entre 500 € et 1 500 €', icon: Shield },
        { value: 'sup_1500', label: 'Plus de 1 500 €', icon: ShieldPlus },
      ]},
      { id: 'trot_formule', type: 'card-select', title: 'Quelles garanties recherchez-vous ?', field: 'coverageLevel', arthurHint: 'Le niveau de garantie choisi détermine l\'étendue de votre protection.', options: [
        { value: 'rc', label: 'Responsabilité civile seule', description: 'Minimum légal obligatoire — dès 2,90 €/mois', icon: Shield },
        { value: 'rc_vol', label: 'RC + Vol', description: 'Avec antivol homologué', icon: ShieldCheck },
        { value: 'tous_risques', label: 'Tous risques + Assistance', description: 'RC, vol, casse, vandalisme, dépannage', icon: ShieldPlus },
      ]},
      { id: 'trot_antivol', type: 'card-select', title: 'Utilisez-vous un antivol ?', subtitle: 'Un antivol homologué SRA conditionne la garantie vol.', field: 'antitheftDevice', arthurHint: 'Un antivol homologué peut réduire votre tarif.', options: [
        { value: 'sra', label: 'Oui, antivol homologué SRA', icon: Lock },
        { value: 'standard', label: 'Oui, antivol standard', icon: ShieldCheck },
        { value: 'aucun', label: 'Non, pas encore', icon: AlertTriangle },
      ]},
      { id: 'trot_stationnement', type: 'card-select', title: 'Où stationnez-vous votre trottinette ?', field: 'parkingType', arthurHint: 'Le lieu de stationnement influence le risque de vol évalué.', options: [
        { value: 'garage', label: 'Garage / local fermé', icon: Lock },
        { value: 'appartement', label: 'Domicile (appartement/maison)', icon: Building },
        { value: 'exterieur', label: 'Rue / extérieur', icon: AlertTriangle },
      ]},
      { id: 'trot_conducteur', type: 'card-select', title: "Quel est l'âge du conducteur principal ?", subtitle: 'La conduite d\'un EDPM est interdite aux moins de 14 ans.', field: 'driverAge', arthurHint: 'L\'âge du conducteur est un facteur important du tarif.', options: [
        { value: '14_17', label: '14 à 17 ans', icon: User },
        { value: '18_25', label: '18 à 25 ans', icon: User },
        { value: '26_59', label: '26 à 59 ans', icon: Users },
        { value: 'sup_60', label: '60 ans et plus', icon: Award },
      ]},
      { id: 'trot_sinistres', type: 'card-select', title: 'Avez-vous eu un sinistre sur les 24 derniers mois ?', field: 'claimsHistory', arthurHint: 'Votre historique de sinistres influence directement le tarif proposé.', options: [
        { value: 'aucun', label: 'Aucun sinistre', icon: ShieldCheck },
        { value: 'vol', label: 'Un vol', icon: Lock },
        { value: 'accident', label: 'Un accident / une casse', icon: AlertTriangle },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],

    camping_car: [
      { id: 'cc_type', type: 'card-select', title: 'Quel type de camping-car possédez-vous ?', field: 'vehicleSubtype', arthurHint: 'Le type de camping-car influence sa valeur et le coût de réparation.', options: [
        { value: 'capucine', label: 'Capucine / Profilé', icon: Truck },
        { value: 'integral', label: 'Intégral', icon: Castle },
        { value: 'fourgon', label: 'Van / Fourgon aménagé', icon: Car },
      ]},
      { id: 'cc_formule', type: 'card-select', title: 'Quelle formule souhaitez-vous ?', field: 'coverageLevel', arthurHint: 'Le niveau de garantie détermine l\'étendue de votre protection.', options: [
        { value: 'tiers', label: 'Au tiers', icon: Shield },
        { value: 'tiers_plus', label: 'Tiers étendu (vol/incendie)', icon: ShieldCheck },
        { value: 'tous_risques', label: 'Tous risques', icon: ShieldPlus },
      ]},
      { id: 'cc_usage', type: 'card-select', title: 'Quel est votre usage annuel ?', field: 'vehicleUse', arthurHint: 'Votre usage annuel (kilométrage) influence l\'exposition au risque.', options: [
        { value: 'occasionnel', label: 'Occasionnel (< 5 000 km/an)', icon: Calendar },
        { value: 'regulier', label: 'Régulier (5 000 - 15 000 km)', icon: Activity },
        { value: 'intensif', label: 'Intensif (> 15 000 km)', icon: Award },
      ]},
      vehicleYearStep, ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    sans_permis: [
      { id: 'sp_type', type: 'card-select', title: 'Quel type de véhicule sans permis ?', field: 'vehicleSubtype', arthurHint: 'Le type de véhicule sans permis détermine les garanties disponibles.', options: [
        { value: 'voiturette', label: 'Voiturette (quadricycle léger)', icon: Car },
        { value: 'scooter', label: 'Scooter 50cm³', icon: Bike },
        { value: 'autre', label: 'Autre (quad, etc.)', icon: Activity },
      ]},
      { id: 'sp_formule', type: 'card-select', title: 'Quelle formule recherchez-vous ?', field: 'coverageLevel', arthurHint: 'Le niveau de garantie choisi définit l\'étendue de la couverture.', options: [
        { value: 'tiers', label: 'Au tiers (obligatoire)', icon: Shield },
        { value: 'tiers_plus', label: 'Tiers + vol / incendie', icon: ShieldCheck },
        { value: 'tous_risques', label: 'Tous risques', icon: ShieldPlus },
      ]},
      { id: 'sp_conducteur', type: 'card-select', title: 'Qui sera le conducteur principal ?', field: 'driverProfile', arthurHint: 'Le profil du conducteur principal est un facteur clé du tarif.', options: [
        { value: 'jeune', label: 'Jeune (14-18 ans, sans permis B)', icon: User },
        { value: 'adulte', label: 'Adulte sans permis B', icon: User },
        { value: 'senior', label: 'Senior (suspension/perte permis)', icon: User },
      ]},
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    auto_temporaire: [
      { id: 'at_duree', type: 'card-select', title: 'Quelle durée souhaitez-vous assurer ?', field: 'duration', arthurHint: 'La durée d\'assurance souhaitée détermine directement le tarif total.', options: [
        { value: '1_3j', label: '1 à 3 jours', icon: Clock },
        { value: '4_15j', label: '4 à 15 jours', icon: Calendar },
        { value: '16_90j', label: '16 à 90 jours', icon: Calendar },
      ]},
      { id: 'at_motif', type: 'card-select', title: 'Pour quelle utilisation ?', field: 'usage', arthurHint: 'Le motif d\'utilisation aide à proposer la formule la plus adaptée.', options: [
        { value: 'voyage', label: 'Voyage / vacances', icon: Globe },
        { value: 'achat_vente', label: 'Achat / vente d\'un véhicule', icon: Car },
        { value: 'pret_emprunt', label: 'Prêt ou emprunt ponctuel', icon: KeyRound },
      ]},
      { id: 'at_formule', type: 'card-select', title: 'Quelle formule ?', field: 'coverageLevel', arthurHint: 'Le niveau de garantie choisi définit l\'étendue de la couverture temporaire.', options: [
        { value: 'tiers', label: 'Au tiers', icon: Shield },
        { value: 'tiers_plus', label: 'Tiers étendu', icon: ShieldCheck },
        { value: 'tous_risques', label: 'Tous risques', icon: ShieldPlus },
      ]},
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    flotte: [
      { id: 'fl_taille', type: 'card-select', title: 'Combien de véhicules à assurer ?', field: 'fleetSize', arthurHint: 'Le nombre de véhicules à assurer détermine le tarif global de la flotte.', options: [
        { value: '3_5', label: '3 à 5 véhicules', icon: Car },
        { value: '6_20', label: '6 à 20 véhicules', icon: Truck },
        { value: 'sup_20', label: 'Plus de 20 véhicules', icon: Building2 },
      ]},
      { id: 'fl_compo', type: 'card-select', title: 'Composition de votre flotte ?', field: 'fleetComposition', arthurHint: 'La composition de la flotte (VP, utilitaires) influence le niveau de risque.', options: [
        { value: 'vp', label: 'Véhicules particuliers', icon: Car },
        { value: 'utilitaires', label: 'Utilitaires / fourgons', icon: Truck },
        { value: 'mixte', label: 'Mixte (VP + utilitaires)', icon: Briefcase },
      ]},
      { id: 'fl_usage', type: 'card-select', title: 'Usage principal ?', field: 'vehicleUse', arthurHint: 'L\'usage principal de la flotte impacte directement le tarif.', options: [
        { value: 'tournee', label: 'Tournées / livraisons', icon: Truck },
        { value: 'commercial', label: 'Déplacements commerciaux', icon: Briefcase },
        { value: 'mixte', label: 'Mixte', icon: Scale },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    cyber: [
      { id: 'cy_taille', type: 'card-select', title: 'Quelle est la taille de votre entreprise ?', field: 'companySize', arthurHint: 'La taille de l\'entreprise détermine l\'ampleur du risque cyber à couvrir.', options: [
        { value: 'tpe', label: 'TPE (< 10 salariés)', icon: User },
        { value: 'pme', label: 'PME (10 - 250 salariés)', icon: Users },
        { value: 'eti', label: 'ETI / Grand groupe', icon: Building2 },
      ]},
      { id: 'cy_donnees', type: 'card-select', title: 'Manipulez-vous des données sensibles ?', field: 'dataSensitivity', arthurHint: 'La sensibilité des données manipulées est un facteur clé du tarif cyber.', options: [
        { value: 'oui_clients', label: 'Oui (données clients RGPD)', icon: Database },
        { value: 'oui_sante_fin', label: 'Oui (santé / financier)', icon: HeartPulse },
        { value: 'non', label: 'Peu / pas de données sensibles', icon: Shield },
      ]},
      { id: 'cy_ca', type: 'card-select', title: 'Quel est votre chiffre d\'affaires annuel ?', field: 'revenue', arthurHint: 'Le chiffre d\'affaires influence le plafond de garantie nécessaire.', options: [
        { value: 'sub_500k', label: 'Moins de 500 k€', icon: Wallet },
        { value: '500k_5m', label: '500 k€ - 5 M€', icon: Landmark },
        { value: 'sup_5m', label: 'Plus de 5 M€', icon: Building2 },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    decennale: [
      { id: 'dc_metier', type: 'card-select', title: 'Quel est votre métier du bâtiment ?', field: 'activityType', arthurHint: 'Votre métier du bâtiment détermine le niveau de risque couvert.', options: [
        { value: 'gros_oeuvre', label: 'Gros œuvre (maçon, charpentier)', icon: HardHat },
        { value: 'second_oeuvre', label: 'Second œuvre (électricien, plombier)', icon: Hammer },
        { value: 'finition', label: 'Finition (peintre, carreleur)', icon: Sparkles },
        { value: 'autre', label: 'Autre / multi-activités', icon: Building },
      ]},
      { id: 'dc_statut', type: 'card-select', title: 'Quel est votre statut juridique ?', field: 'legalStatus', arthurHint: 'Le statut juridique influence les responsabilités à assurer.', options: [
        { value: 'micro', label: 'Auto-entrepreneur / micro', icon: User },
        { value: 'sasu_eurl', label: 'SASU / EURL', icon: Briefcase },
        { value: 'sas_sarl', label: 'SAS / SARL', icon: Building2 },
      ]},
      { id: 'dc_ca', type: 'card-select', title: 'Chiffre d\'affaires annuel ?', field: 'revenue', arthurHint: 'Le chiffre d\'affaires est un critère central du calcul de la prime décennale.', options: [
        { value: 'sub_70k', label: 'Moins de 70 k€', icon: Wallet },
        { value: '70_250k', label: '70 - 250 k€', icon: Briefcase },
        { value: 'sup_250k', label: 'Plus de 250 k€', icon: Building2 },
      ]},
      { id: 'dc_anciennete', type: 'card-select', title: 'Depuis combien de temps exercez-vous ?', field: 'experience', arthurHint: 'Votre ancienneté dans le métier est un facteur pris en compte dans le tarif.', options: [
        { value: 'creation', label: 'Création / < 1 an', icon: Sparkles },
        { value: '1_5', label: '1 à 5 ans', icon: Activity },
        { value: 'sup_5', label: 'Plus de 5 ans', icon: Award },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    protection_juridique: [
      { id: 'pj_profil', type: 'card-select', title: 'Pour qui souhaitez-vous une protection juridique ?', field: 'profile', arthurHint: 'Le profil assuré (particulier, pro, entreprise) détermine les litiges couverts.', options: [
        { value: 'particulier', label: 'Particulier / famille', icon: User },
        { value: 'pro', label: 'Professionnel / indépendant', icon: Briefcase },
        { value: 'entreprise', label: 'Entreprise / société', icon: Building2 },
      ]},
      { id: 'pj_domaines', type: 'card-select', title: 'Quels litiges souhaitez-vous couvrir en priorité ?', field: 'coverageScope', arthurHint: 'Les domaines de litiges prioritaires orientent la formule la plus adaptée.', options: [
        { value: 'conso_habitat', label: 'Consommation / habitation', icon: Home },
        { value: 'travail', label: 'Travail / contrat', icon: FileText },
        { value: 'tous', label: 'Tous domaines (vie privée + pro)', icon: Scale },
      ]},
      { id: 'pj_formule', type: 'card-select', title: 'Quel niveau de couverture ?', field: 'coverageLevel', arthurHint: 'Le niveau de couverture choisi définit l\'étendue de votre protection juridique.', options: [
        { value: 'essentielle', label: 'Essentielle', icon: Shield },
        { value: 'confort', label: 'Confort', icon: ShieldCheck },
        { value: 'premium', label: 'Premium (avocat libre choix)', icon: ShieldPlus },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    mutuelle_entreprise: [
      { id: 'me_effectif', type: 'card-select', title: 'Combien de salariés à couvrir ?', field: 'staffSize', arthurHint: 'Le nombre de salariés à couvrir détermine le tarif global du contrat.', options: [
        { value: '1_5', label: '1 à 5 salariés', icon: User },
        { value: '6_20', label: '6 à 20 salariés', icon: Users },
        { value: '21_100', label: '21 à 100 salariés', icon: Building },
        { value: 'sup_100', label: 'Plus de 100 salariés', icon: Building2 },
      ]},
      { id: 'me_convention', type: 'card-select', title: 'Avez-vous une convention collective imposant un socle ?', field: 'collectiveAgreement', arthurHint: 'Une convention collective peut imposer un socle minimum de garanties.', options: [
        { value: 'oui_connue', label: 'Oui, je connais le socle', icon: ShieldCheck },
        { value: 'oui_a_verifier', label: 'Oui, mais à vérifier', icon: Search },
        { value: 'non', label: 'Non / je ne sais pas', icon: AlertTriangle },
      ]},
      { id: 'me_niveau', type: 'card-select', title: 'Quel niveau de garanties souhaitez-vous ?', field: 'coverageLevel', arthurHint: 'Le niveau de garanties choisi définit l\'étendue de la couverture proposée.', options: [
        { value: 'socle_anim', label: 'Socle ANI (minimum légal)', icon: Shield },
        { value: 'intermediaire', label: 'Intermédiaire (confort)', icon: ShieldCheck },
        { value: 'premium', label: 'Premium (optique/dentaire renforcés)', icon: ShieldPlus },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
  };

};

// Backward-compatible export — fallback returns French text by reading raw keys via no-op t.
// Components should prefer buildStepConfigs(t) for proper i18n.
import frFallback from '@/i18n/fr';
export const stepConfigsByType: Record<InsuranceType, FormStep[]> = buildStepConfigs(
  (key, vars) => {
    let raw = (frFallback as Record<string, string>)[key] || key;
    if (vars) for (const [k, v] of Object.entries(vars)) raw = raw.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    return raw;
  }
);
