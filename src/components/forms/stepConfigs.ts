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
import { TROTTINETTE_RC_PRICE_MONTHLY } from '@/config/site';

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
  /** Option A (bonus-malus) : sur une etape card-select, ajoute un lien qui
   * revele un champ numerique precis pour le meme `field`, en plus des cartes
   * rapides. Ignore pour les autres types d'etape. */
  preciseInput?: { min: number; max: number; step: number; placeholder: string; label: string };
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
    arthurHint: t('step.shared.postalCode.arthurHint'),
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
    arthurHint: t('step.shared.age.arthurHint'),
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
    arthurHint: t('step.shared.vehicleBrandAuto.arthurHint'),
  };

  const vehicleModelStepAuto: FormStep = {
    id: 'vehicleModel',
    type: 'vehicle-select',
    title: t('step.shared.vehicleModel.title'),
    subtitle: t('step.shared.vehicleModel.subtitle'),
    field: 'vehicleModel',
    vehicleType: 'auto',
    vehicleField: 'model',
    arthurHint: t('step.shared.vehicleModel.arthurHint'),
    showUnsureButton: true,
  };

  const vehicleYearStep: FormStep = {
    id: 'vehicleYear',
    type: 'input',
    title: t('step.shared.vehicleYear.title'),
    subtitle: t('step.shared.vehicleYear.subtitle'),
    field: 'vehicleYear',
    arthurHint: t('step.shared.vehicleYear.arthurHint'),
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
    arthurHint: t('step.shared.vehicleBrandMoto.arthurHint'),
  };

  const vehicleModelStepMoto: FormStep = {
    id: 'vehicleModel',
    type: 'vehicle-select',
    title: t('step.shared.vehicleModel.title'),
    subtitle: t('step.shared.vehicleModel.subtitle'),
    field: 'vehicleModel',
    vehicleType: 'moto',
    vehicleField: 'model',
    arthurHint: t('step.shared.vehicleModel.arthurHint'),
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
      ], t('step.auto.formule.arthurHint')),
      vehicleBrandStepAuto,
      vehicleModelStepAuto,
      vehicleYearStep,
      cs('auto', 'usage_auto', 'vehicleUse', [
        opt(t, 'auto', 'usage_auto', 'prive', User),
        opt(t, 'auto', 'usage_auto', 'trajet_travail', Briefcase),
        opt(t, 'auto', 'usage_auto', 'pro', Building2),
      ], t('step.auto.usage_auto.arthurHint')),
      {
        ...cs('auto', 'bonus_malus_auto', 'bonusMalus', [
          opt(t, 'auto', 'bonus_malus_auto', 'bonus_050', Award),
          opt(t, 'auto', 'bonus_malus_auto', 'standard', ShieldCheck),
          opt(t, 'auto', 'bonus_malus_auto', 'malus', AlertTriangle),
        ], t('step.auto.bonus_malus_auto.arthurHint')),
        showUnsureButton: true,
        unsureDefaultValue: 'standard',
        preciseInput: { min: 0.5, max: 3.5, step: 0.01, placeholder: t('step.shared.bonusMalusPrecise.placeholder'), label: t('step.shared.bonusMalusPrecise.label') },
      },
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    moto: [
      cs('moto', 'formule', 'coverageLevel', [
        opt(t, 'moto', 'formule', 'tiers', Shield),
        opt(t, 'moto', 'formule', 'tiers_plus', ShieldCheck),
        opt(t, 'moto', 'formule', 'tous_risques', ShieldPlus),
      ], t('step.moto.formule.arthurHint')),
      vehicleBrandStepMoto,
      vehicleModelStepMoto,
      vehicleYearStep,
      cs('moto', 'cylindree_moto', 'engineSize', [
        opt(t, 'moto', 'cylindree_moto', '50', Bike),
        opt(t, 'moto', 'cylindree_moto', '125', Bike),
        opt(t, 'moto', 'cylindree_moto', 'medium', Bike),
        opt(t, 'moto', 'cylindree_moto', 'large', AlertTriangle),
      ], t('step.moto.cylindree_moto.arthurHint')),
      cs('moto', 'stationnement_moto', 'parkingType', [
        opt(t, 'moto', 'stationnement_moto', 'garage', Lock),
        opt(t, 'moto', 'stationnement_moto', 'parking', Building),
        opt(t, 'moto', 'stationnement_moto', 'rue', AlertTriangle),
      ], t('step.moto.stationnement_moto.arthurHint')),
      {
        ...cs('moto', 'bonus_malus_moto', 'bonusMalus', [
          opt(t, 'moto', 'bonus_malus_moto', 'bonus_050', Award),
          opt(t, 'moto', 'bonus_malus_moto', 'standard', ShieldCheck),
          opt(t, 'moto', 'bonus_malus_moto', 'malus', AlertTriangle),
        ], t('step.moto.bonus_malus_moto.arthurHint')),
        showUnsureButton: true,
        unsureDefaultValue: 'standard',
        preciseInput: { min: 0.5, max: 3.5, step: 0.01, placeholder: t('step.shared.bonusMalusPrecise.placeholder'), label: t('step.shared.bonusMalusPrecise.label') },
      },
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    habitation: [
      cs('habitation', 'logement', 'housingType', [
        opt(t, 'habitation', 'logement', 'appartement', Building),
        opt(t, 'habitation', 'logement', 'maison', Home),
        opt(t, 'habitation', 'logement', 'villa', Castle),
      ], t('step.habitation.logement.arthurHint')),
      cs('habitation', 'formule', 'coverageLevel', [
        opt(t, 'habitation', 'formule', 'essentielle', Shield),
        opt(t, 'habitation', 'formule', 'confort', ShieldCheck),
        opt(t, 'habitation', 'formule', 'premium', ShieldPlus),
      ], t('step.habitation.formule.arthurHint')),
      cs('habitation', 'surface_logement', 'housingSurface', [
        opt(t, 'habitation', 'surface_logement', 'sub_40', Home),
        opt(t, 'habitation', 'surface_logement', '40_90', Building),
        opt(t, 'habitation', 'surface_logement', 'sup_90', Castle),
      ], t('step.habitation.surface_logement.arthurHint')),
      cs('habitation', 'statut_occupant', 'occupancyStatus', [
        opt(t, 'habitation', 'statut_occupant', 'locataire', KeyRound),
        opt(t, 'habitation', 'statut_occupant', 'proprietaire', Home),
        opt(t, 'habitation', 'statut_occupant', 'coproprietaire', Building2),
      ], t('step.habitation.statut_occupant.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    sante: [
      cs('sante', 'situation', 'situation', [
        opt(t, 'sante', 'situation', 'seul', User),
        opt(t, 'sante', 'situation', 'couple', Users),
        opt(t, 'sante', 'situation', 'famille', Baby),
      ], t('step.sante.situation.arthurHint')),
      cs('sante', 'besoins', 'coverageLevel', [
        opt(t, 'sante', 'besoins', 'economique', Stethoscope),
        opt(t, 'sante', 'besoins', 'equilibre', Eye),
        opt(t, 'sante', 'besoins', 'integrale', HeartPulse),
      ], t('step.sante.besoins.arthurHint')),
      cs('sante', 'hospitalisation_sante', 'hospitalCoverage', [
        opt(t, 'sante', 'hospitalisation_sante', 'standard', Stethoscope),
        opt(t, 'sante', 'hospitalisation_sante', 'renforce', ShieldCheck),
        opt(t, 'sante', 'hospitalisation_sante', 'premium', HeartPulse),
      ], t('step.sante.hospitalisation_sante.arthurHint')),
      cs('sante', 'optique_dentaire', 'opticalDentalNeeds', [
        opt(t, 'sante', 'optique_dentaire', 'faibles', Eye),
        opt(t, 'sante', 'optique_dentaire', 'reguliers', Pill),
        opt(t, 'sante', 'optique_dentaire', 'forts', HeartPulse),
      ], t('step.sante.optique_dentaire.arthurHint')),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    pret: [
      cs('pret', 'garanties', 'coverageLevel', [
        opt(t, 'pret', 'garanties', 'deces', Shield),
        opt(t, 'pret', 'garanties', 'deces_ipt', ShieldCheck),
        opt(t, 'pret', 'garanties', 'deces_ipt_itt', ShieldPlus),
      ], t('step.pret.garanties.arthurHint')),
      cs('pret', 'montant_pret', 'loanAmount', [
        opt(t, 'pret', 'montant_pret', 'sub_150k', Wallet),
        opt(t, 'pret', 'montant_pret', '150_300k', Landmark),
        opt(t, 'pret', 'montant_pret', 'sup_300k', Building2),
      ], t('step.pret.montant_pret.arthurHint')),
      cs('pret', 'fumeur_pret', 'smokerStatus', [
        opt(t, 'pret', 'fumeur_pret', 'non', ShieldCheck),
        opt(t, 'pret', 'fumeur_pret', 'ex', Activity),
        opt(t, 'pret', 'fumeur_pret', 'oui', AlertTriangle),
      ], t('step.pret.fumeur_pret.arthurHint')),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    animaux: [
      cs('animaux', 'animal', 'animalType', [
        opt(t, 'animaux', 'animal', 'chien', PawPrint),
        opt(t, 'animaux', 'animal', 'chat', PawPrint),
        opt(t, 'animaux', 'animal', 'nac', PawPrint),
      ], t('step.animaux.animal.arthurHint')),
      cs('animaux', 'formule', 'coverageLevel', [
        opt(t, 'animaux', 'formule', 'accident', Activity),
        opt(t, 'animaux', 'formule', 'maladie_accident', HeartPulse),
        opt(t, 'animaux', 'formule', 'integrale', Heart),
      ], t('step.animaux.formule.arthurHint')),
      cs('animaux', 'age_animal', 'petAge', [
        opt(t, 'animaux', 'age_animal', 'junior', PawPrint),
        opt(t, 'animaux', 'age_animal', 'adult', PawPrint),
        opt(t, 'animaux', 'age_animal', 'senior', HeartPulse),
      ], t('step.animaux.age_animal.arthurHint')),
      cs('animaux', 'race_animal', 'petRisk', [
        opt(t, 'animaux', 'race_animal', 'standard', ShieldCheck),
        opt(t, 'animaux', 'race_animal', 'race_sensible', AlertTriangle),
        opt(t, 'animaux', 'race_animal', 'antecedents', Stethoscope),
      ], t('step.animaux.race_animal.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    vie: [
      cs('vie', 'objectif', 'coverageLevel', [
        opt(t, 'vie', 'objectif', 'epargne', Wallet),
        opt(t, 'vie', 'objectif', 'protection', Umbrella),
        opt(t, 'vie', 'objectif', 'mixte', Landmark),
      ], t('step.vie.objectif.arthurHint')),
      cs('vie', 'versement_initial', 'initialPayment', [
        opt(t, 'vie', 'versement_initial', 'sub_5k', Wallet),
        opt(t, 'vie', 'versement_initial', '5_50k', Landmark),
        opt(t, 'vie', 'versement_initial', 'sup_50k', Award),
      ], t('step.vie.versement_initial.arthurHint')),
      cs('vie', 'horizon_vie', 'investmentHorizon', [
        opt(t, 'vie', 'horizon_vie', 'sub_4', Calendar),
        opt(t, 'vie', 'horizon_vie', '4_8', ShieldCheck),
        opt(t, 'vie', 'horizon_vie', 'sup_8', Sparkles),
      ], t('step.vie.horizon_vie.arthurHint')),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    prevoyance: [
      cs('prevoyance', 'formule', 'coverageLevel', [
        opt(t, 'prevoyance', 'formule', 'essentielle', Shield),
        opt(t, 'prevoyance', 'formule', 'confort', ShieldCheck),
        opt(t, 'prevoyance', 'formule', 'integrale', ShieldPlus),
      ], t('step.prevoyance.formule.arthurHint')),
      cs('prevoyance', 'statut_prevoyance', 'professionalStatus', [
        opt(t, 'prevoyance', 'statut_prevoyance', 'salarie', Briefcase),
        opt(t, 'prevoyance', 'statut_prevoyance', 'tns', User),
        opt(t, 'prevoyance', 'statut_prevoyance', 'dirigeant', Building2),
      ], t('step.prevoyance.statut_prevoyance.arthurHint')),
      cs('prevoyance', 'revenu_prevoyance', 'incomeToProtect', [
        opt(t, 'prevoyance', 'revenu_prevoyance', 'sub_2k', Wallet),
        opt(t, 'prevoyance', 'revenu_prevoyance', '2_4k', ShieldCheck),
        opt(t, 'prevoyance', 'revenu_prevoyance', 'sup_4k', Award),
      ], t('step.prevoyance.revenu_prevoyance.arthurHint')),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    rc_pro: [
      cs('rc_pro', 'activite', 'activityType', [
        opt(t, 'rc_pro', 'activite', 'liberal', Briefcase),
        opt(t, 'rc_pro', 'activite', 'commerce', Scale),
        opt(t, 'rc_pro', 'activite', 'tech', FileText),
      ], t('step.rc_pro.activite.arthurHint')),
      cs('rc_pro', 'formule', 'coverageLevel', [
        opt(t, 'rc_pro', 'formule', 'basique', Shield),
        opt(t, 'rc_pro', 'formule', 'standard', ShieldCheck),
        opt(t, 'rc_pro', 'formule', 'premium', ShieldPlus),
      ], t('step.rc_pro.formule.arthurHint')),
      cs('rc_pro', 'ca_rcpro', 'revenue', [
        opt(t, 'rc_pro', 'ca_rcpro', 'sub_50k', Wallet),
        opt(t, 'rc_pro', 'ca_rcpro', '50_250k', Briefcase),
        opt(t, 'rc_pro', 'ca_rcpro', 'sup_250k', Building2),
      ], t('step.rc_pro.ca_rcpro.arthurHint')),
      cs('rc_pro', 'clients_rcpro', 'clientType', [
        opt(t, 'rc_pro', 'clients_rcpro', 'particuliers', Users),
        opt(t, 'rc_pro', 'clients_rcpro', 'entreprises', Building2),
        opt(t, 'rc_pro', 'clients_rcpro', 'mixte', Scale),
      ], t('step.rc_pro.clients_rcpro.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    mrp: [
      cs('mrp', 'formule', 'coverageLevel', [
        opt(t, 'mrp', 'formule', 'essentielle', Shield),
        opt(t, 'mrp', 'formule', 'confort', ShieldCheck),
        opt(t, 'mrp', 'formule', 'premium', ShieldPlus),
      ], t('step.mrp.formule.arthurHint')),
      cs('mrp', 'local_mrp', 'businessPremises', [
        opt(t, 'mrp', 'local_mrp', 'bureau', Building),
        opt(t, 'mrp', 'local_mrp', 'commerce', Briefcase),
        opt(t, 'mrp', 'local_mrp', 'atelier', HardHat),
      ], t('step.mrp.local_mrp.arthurHint')),
      cs('mrp', 'stock_mrp', 'equipmentValue', [
        opt(t, 'mrp', 'stock_mrp', 'sub_10k', Shield),
        opt(t, 'mrp', 'stock_mrp', '10_50k', ShieldCheck),
        opt(t, 'mrp', 'stock_mrp', 'sup_50k', ShieldPlus),
      ], t('step.mrp.stock_mrp.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    gli: [
      cs('gli', 'formule', 'coverageLevel', [
        opt(t, 'gli', 'formule', 'basique', Shield),
        opt(t, 'gli', 'formule', 'standard', ShieldCheck),
        opt(t, 'gli', 'formule', 'premium', ShieldPlus),
      ], t('step.gli.formule.arthurHint')),
      cs('gli', 'loyer_gli', 'monthlyRent', [
        opt(t, 'gli', 'loyer_gli', 'sub_700', Wallet),
        opt(t, 'gli', 'loyer_gli', '700_1500', Home),
        opt(t, 'gli', 'loyer_gli', 'sup_1500', Building2),
      ], t('step.gli.loyer_gli.arthurHint')),
      cs('gli', 'locataire_gli', 'tenantStatus', [
        opt(t, 'gli', 'locataire_gli', 'nouveau', Search),
        opt(t, 'gli', 'locataire_gli', 'en_place_ok', ShieldCheck),
        opt(t, 'gli', 'locataire_gli', 'incident', AlertTriangle),
      ], t('step.gli.locataire_gli.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    pno: [
      cs('pno', 'formule', 'coverageLevel', [
        opt(t, 'pno', 'formule', 'essentielle', Shield),
        opt(t, 'pno', 'formule', 'confort', ShieldCheck),
        opt(t, 'pno', 'formule', 'premium', ShieldPlus),
      ], t('step.pno.formule.arthurHint')),
      cs('pno', 'occupation_pno', 'propertyOccupancy', [
        opt(t, 'pno', 'occupation_pno', 'loue', KeyRound),
        opt(t, 'pno', 'occupation_pno', 'vacant', Home),
        opt(t, 'pno', 'occupation_pno', 'travaux', HardHat),
      ], t('step.pno.occupation_pno.arthurHint')),
      cs('pno', 'type_bien_pno', 'propertyType', [
        opt(t, 'pno', 'type_bien_pno', 'appartement', Building),
        opt(t, 'pno', 'type_bien_pno', 'maison', Home),
        opt(t, 'pno', 'type_bien_pno', 'immeuble', Building2),
      ], t('step.pno.type_bien_pno.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    gestion_locative: [
      cs('gestion_locative', 'propertyCount', 'propertyCount', [
        opt(t, 'gestion_locative', 'propertyCount', '1', Home),
        opt(t, 'gestion_locative', 'propertyCount', '2-5', Building),
        opt(t, 'gestion_locative', 'propertyCount', '5+', Building2),
      ], t('step.gestion_locative.propertyCount.arthurHint')),
      cs('gestion_locative', 'managementType', 'managementType', [
        opt(t, 'gestion_locative', 'managementType', 'full', ShieldPlus),
        opt(t, 'gestion_locative', 'managementType', 'partial', ShieldCheck),
        opt(t, 'gestion_locative', 'managementType', 'declaration', FileText),
      ], t('step.gestion_locative.managementType.arthurHint')),
      cs('gestion_locative', 'rentCollection', 'rentCollection', [
        opt(t, 'gestion_locative', 'rentCollection', 'oui', Wallet),
        opt(t, 'gestion_locative', 'rentCollection', 'non', User),
        opt(t, 'gestion_locative', 'rentCollection', 'a_decider', Search),
      ], t('step.gestion_locative.rentCollection.arthurHint')),
      cs('gestion_locative', 'gli_included', 'includeGLI', [
        opt(t, 'gestion_locative', 'gli_included', 'oui', Lock),
        opt(t, 'gestion_locative', 'gli_included', 'non', FileText),
        opt(t, 'gestion_locative', 'gli_included', 'comparer', Scale),
      ], t('step.gestion_locative.gli_included.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    comparateur: [
      cs('comparateur', 'type', 'insuranceType', [
        opt(t, 'comparateur', 'type', 'auto', Car, mascotCar),
        opt(t, 'comparateur', 'type', 'moto', Bike, mascotMoto),
        opt(t, 'comparateur', 'type', 'habitation', Home, mascotHouse),
        opt(t, 'comparateur', 'type', 'trottinette', Zap, mascotScoot),
        opt(t, 'comparateur', 'type', 'velo', Bike, mascotBike),
        opt(t, 'comparateur', 'type', 'sante', Heart, mascotSick),
        opt(t, 'comparateur', 'type', 'pno', Building, mascotHouse),
        opt(t, 'comparateur', 'type', 'gli', Lock, mascotDetective),
        opt(t, 'comparateur', 'type', 'vie', Landmark, mascotIdea),
        opt(t, 'comparateur', 'type', 'rc_pro', Briefcase, mascotBusiness),
        opt(t, 'comparateur', 'type', 'prevoyance', Umbrella, mascotInjured),
        opt(t, 'comparateur', 'type', 'pret', FileText, mascotThinking),
        opt(t, 'comparateur', 'type', 'mrp', Building2, mascotBusiness),
        opt(t, 'comparateur', 'type', 'gestion_locative', KeyRound, mascotHouse),
      ], t('step.comparateur.type.arthurHint')),
      cs('comparateur', 'formule', 'coverageLevel', [
        opt(t, 'comparateur', 'formule', 'essentielle', Shield),
        opt(t, 'comparateur', 'formule', 'confort', ShieldCheck),
        opt(t, 'comparateur', 'formule', 'premium', ShieldPlus),
      ], t('step.comparateur.formule.arthurHint')),
      postalCodeStep, searchingStep, contactStep,
    ],
    metiers_atypiques: [
      cs('metiers_atypiques', 'famille_activite', 'activityFamily', [
        opt(t, 'metiers_atypiques', 'famille_activite', 'parc_aventure', TreePine),
        opt(t, 'metiers_atypiques', 'famille_activite', 'sport_outdoor', Mountain),
        opt(t, 'metiers_atypiques', 'famille_activite', 'evenementiel', PartyPopper),
        opt(t, 'metiers_atypiques', 'famille_activite', 'btp_specialise', HardHat),
        opt(t, 'metiers_atypiques', 'famille_activite', 'autre', Sparkles),
      ], t('step.metiers_atypiques.famille_activite.arthurHint')),
      {
        id: 'description_activite',
        type: 'input',
        title: t('step.metiers_atypiques.description_activite.title'),
        subtitle: t('step.metiers_atypiques.description_activite.subtitle'),
        field: 'activityDescription',
        arthurHint: t('step.metiers_atypiques.description_activite.arthurHint'),
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
      ], t('step.metiers_atypiques.statut.arthurHint')),
      cs('metiers_atypiques', 'public_encadre', 'publicExposure', [
        opt(t, 'metiers_atypiques', 'public_encadre', 'aucun', Lock),
        opt(t, 'metiers_atypiques', 'public_encadre', 'adultes', User),
        opt(t, 'metiers_atypiques', 'public_encadre', 'mixte', Users),
        opt(t, 'metiers_atypiques', 'public_encadre', 'mineurs', Baby),
      ], t('step.metiers_atypiques.public_encadre.arthurHint')),
      cs('metiers_atypiques', 'frequentation', 'attendance', [
        opt(t, 'metiers_atypiques', 'frequentation', 'sub_500', Calendar),
        opt(t, 'metiers_atypiques', 'frequentation', '500_5k', Users),
        opt(t, 'metiers_atypiques', 'frequentation', '5k_50k', Users),
        opt(t, 'metiers_atypiques', 'frequentation', 'sup_50k', PartyPopper),
      ], t('step.metiers_atypiques.frequentation.arthurHint')),
      cs('metiers_atypiques', 'salaries', 'staffSize', [
        opt(t, 'metiers_atypiques', 'salaries', 'solo', User),
        opt(t, 'metiers_atypiques', 'salaries', '2_5', Users),
        opt(t, 'metiers_atypiques', 'salaries', '6_20', Users),
        opt(t, 'metiers_atypiques', 'salaries', 'sup_20', Building2),
      ], t('step.metiers_atypiques.salaries.arthurHint')),
      cs('metiers_atypiques', 'ca', 'revenue', [
        opt(t, 'metiers_atypiques', 'ca', 'sub_50k', Wallet),
        opt(t, 'metiers_atypiques', 'ca', '50_200k', Wallet),
        opt(t, 'metiers_atypiques', 'ca', '200k_1m', Wallet),
        opt(t, 'metiers_atypiques', 'ca', 'sup_1m', Wallet),
      ], t('step.metiers_atypiques.ca.arthurHint')),
      cs('metiers_atypiques', 'certifications', 'certifications', [
        opt(t, 'metiers_atypiques', 'certifications', 'oui_majeures', Award),
        opt(t, 'metiers_atypiques', 'certifications', 'oui_partielles', ShieldCheck),
        opt(t, 'metiers_atypiques', 'certifications', 'non', AlertTriangle),
        opt(t, 'metiers_atypiques', 'certifications', 'en_cours', Activity),
      ], t('step.metiers_atypiques.certifications.arthurHint')),
      cs('metiers_atypiques', 'sinistres', 'claimsHistory', [
        opt(t, 'metiers_atypiques', 'sinistres', 'aucun', ShieldCheck),
        opt(t, 'metiers_atypiques', 'sinistres', '1_2', Shield),
        opt(t, 'metiers_atypiques', 'sinistres', '3_5', AlertTriangle),
        opt(t, 'metiers_atypiques', 'sinistres', 'sup_5', AlertTriangle),
      ], t('step.metiers_atypiques.sinistres.arthurHint')),
      postalCodeStep,
      {
        id: 'callback',
        type: 'callback',
        title: t('step.metiers_atypiques.callback.title'),
        subtitle: t('step.metiers_atypiques.callback.subtitle'),
      },
    ],
    // ============ NICHES (clés step.<produit>.* extraites le 2026-10-03) ============
    velo: [
      { id: 'velo_type', type: 'card-select', title: t('step.velo.velo_type.title'), field: 'bikeType', arthurHint: t('step.velo.velo_type.arthurHint'), options: [
        { value: 'musculaire', label: t('step.velo.velo_type.opt.musculaire.label'), description: t('step.velo.velo_type.opt.musculaire.description'), icon: Bike },
        { value: 'vae', label: t('step.velo.velo_type.opt.vae.label'), description: t('step.velo.velo_type.opt.vae.description'), icon: Zap },
        { value: 'cargo', label: t('step.velo.velo_type.opt.cargo.label'), description: t('step.velo.velo_type.opt.cargo.description'), icon: Truck },
      ]},
      { id: 'velo_valeur', type: 'card-select', title: t('step.velo.velo_valeur.title'), field: 'bikeValue', arthurHint: t('step.velo.velo_valeur.arthurHint'), options: [
        { value: 'sub_800', label: t('step.velo.velo_valeur.opt.sub_800.label'), icon: Wallet },
        { value: '800_2500', label: t('step.velo.velo_valeur.opt.800_2500.label'), icon: Shield },
        { value: 'sup_2500', label: t('step.velo.velo_valeur.opt.sup_2500.label'), icon: ShieldPlus },
      ]},
      { id: 'velo_formule', type: 'card-select', title: t('step.velo.velo_formule.title'), field: 'coverageLevel', arthurHint: t('step.velo.velo_formule.arthurHint'), options: [
        { value: 'vol', label: t('step.velo.velo_formule.opt.vol.label'), description: t('step.velo.velo_formule.opt.vol.description'), icon: Lock },
        { value: 'vol_casse', label: t('step.velo.velo_formule.opt.vol_casse.label'), description: t('step.velo.velo_formule.opt.vol_casse.description'), icon: ShieldCheck },
        { value: 'tous_risques', label: t('step.velo.velo_formule.opt.tous_risques.label'), description: t('step.velo.velo_formule.opt.tous_risques.description'), icon: ShieldPlus },
      ]},
      { id: 'velo_stationnement', type: 'card-select', title: t('step.velo.velo_stationnement.title'), field: 'parkingType', arthurHint: t('step.velo.velo_stationnement.arthurHint'), options: [
        { value: 'garage', label: t('step.velo.velo_stationnement.opt.garage.label'), icon: Lock },
        { value: 'local_velo', label: t('step.velo.velo_stationnement.opt.local_velo.label'), icon: Building },
        { value: 'exterieur', label: t('step.velo.velo_stationnement.opt.exterieur.label'), icon: AlertTriangle },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    trottinette: [
      { id: 'trot_engin', type: 'card-select', title: t('step.trottinette.trot_engin.title'), subtitle: t('step.trottinette.trot_engin.subtitle'), field: 'vehicleSubtype', arthurHint: t('step.trottinette.trot_engin.arthurHint'), options: [
        { value: 'trottinette', label: t('step.trottinette.trot_engin.opt.trottinette.label'), description: t('step.trottinette.trot_engin.opt.trottinette.description'), icon: Zap, iconImage: mascotScoot },
        { value: 'trottinette_debridee', label: t('step.trottinette.trot_engin.opt.trottinette_debridee.label'), description: t('step.trottinette.trot_engin.opt.trottinette_debridee.description'), icon: AlertTriangle },
        { value: 'gyroroue', label: t('step.trottinette.trot_engin.opt.gyroroue.label'), description: t('step.trottinette.trot_engin.opt.gyroroue.description'), icon: Activity },
      ]},
      { id: 'trot_usage', type: 'card-select', title: t('step.trottinette.trot_usage.title'), field: 'vehicleUse', arthurHint: t('step.trottinette.trot_usage.arthurHint'), options: [
        { value: 'perso', label: t('step.trottinette.trot_usage.opt.perso.label'), description: t('step.trottinette.trot_usage.opt.perso.description'), icon: Zap },
        { value: 'domicile_travail', label: t('step.trottinette.trot_usage.opt.domicile_travail.label'), description: t('step.trottinette.trot_usage.opt.domicile_travail.description'), icon: Activity },
        { value: 'livreur', label: t('step.trottinette.trot_usage.opt.livreur.label'), description: t('step.trottinette.trot_usage.opt.livreur.description'), icon: Truck },
      ]},
      { id: 'trot_valeur', type: 'card-select', title: t('step.trottinette.trot_valeur.title'), subtitle: t('step.trottinette.trot_valeur.subtitle'), field: 'bikeValue', arthurHint: t('step.trottinette.trot_valeur.arthurHint'), options: [
        { value: 'sub_500', label: t('step.trottinette.trot_valeur.opt.sub_500.label'), icon: Wallet },
        { value: '500_1500', label: t('step.trottinette.trot_valeur.opt.500_1500.label'), icon: Shield },
        { value: 'sup_1500', label: t('step.trottinette.trot_valeur.opt.sup_1500.label'), icon: ShieldPlus },
      ]},
      { id: 'trot_formule', type: 'card-select', title: t('step.trottinette.trot_formule.title'), field: 'coverageLevel', arthurHint: t('step.trottinette.trot_formule.arthurHint'), options: [
        // Trois choix gardés (le conseiller a besoin du choix du visiteur) mais
        // sans promettre que vol, casse ou assistance sont inclus chez un
        // assureur donné (décision du 3 octobre 2026).
        { value: 'rc', label: t('step.trottinette.trot_formule.opt.rc.label'), description: t('step.trottinette.trot_formule.opt.rc.description', { prixMensuel: TROTTINETTE_RC_PRICE_MONTHLY }), icon: Shield },
        { value: 'rc_vol', label: t('step.trottinette.trot_formule.opt.rc_vol.label'), description: t('step.trottinette.trot_formule.opt.rc_vol.description'), icon: ShieldCheck },
        { value: 'tous_risques', label: t('step.trottinette.trot_formule.opt.tous_risques.label'), description: t('step.trottinette.trot_formule.opt.tous_risques.description'), icon: ShieldPlus },
      ]},
      { id: 'trot_antivol', type: 'card-select', title: t('step.trottinette.trot_antivol.title'), subtitle: t('step.trottinette.trot_antivol.subtitle'), field: 'antitheftDevice', arthurHint: t('step.trottinette.trot_antivol.arthurHint'), options: [
        { value: 'sra', label: t('step.trottinette.trot_antivol.opt.sra.label'), icon: Lock },
        { value: 'standard', label: t('step.trottinette.trot_antivol.opt.standard.label'), icon: ShieldCheck },
        { value: 'aucun', label: t('step.trottinette.trot_antivol.opt.aucun.label'), icon: AlertTriangle },
      ]},
      { id: 'trot_stationnement', type: 'card-select', title: t('step.trottinette.trot_stationnement.title'), field: 'parkingType', arthurHint: t('step.trottinette.trot_stationnement.arthurHint'), options: [
        { value: 'garage', label: t('step.trottinette.trot_stationnement.opt.garage.label'), icon: Lock },
        { value: 'appartement', label: t('step.trottinette.trot_stationnement.opt.appartement.label'), icon: Building },
        { value: 'exterieur', label: t('step.trottinette.trot_stationnement.opt.exterieur.label'), icon: AlertTriangle },
      ]},
      { id: 'trot_conducteur', type: 'card-select', title: t('step.trottinette.trot_conducteur.title'), subtitle: t('step.trottinette.trot_conducteur.subtitle'), field: 'driverAge', arthurHint: t('step.trottinette.trot_conducteur.arthurHint'), options: [
        { value: '14_17', label: t('step.trottinette.trot_conducteur.opt.14_17.label'), icon: User },
        { value: '18_25', label: t('step.trottinette.trot_conducteur.opt.18_25.label'), icon: User },
        { value: '26_59', label: t('step.trottinette.trot_conducteur.opt.26_59.label'), icon: Users },
        { value: 'sup_60', label: t('step.trottinette.trot_conducteur.opt.sup_60.label'), icon: Award },
      ]},
      { id: 'trot_sinistres', type: 'card-select', title: t('step.trottinette.trot_sinistres.title'), field: 'claimsHistory', arthurHint: t('step.trottinette.trot_sinistres.arthurHint'), options: [
        { value: 'aucun', label: t('step.trottinette.trot_sinistres.opt.aucun.label'), icon: ShieldCheck },
        { value: 'vol', label: t('step.trottinette.trot_sinistres.opt.vol.label'), icon: Lock },
        { value: 'accident', label: t('step.trottinette.trot_sinistres.opt.accident.label'), icon: AlertTriangle },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],

    camping_car: [
      { id: 'cc_type', type: 'card-select', title: t('step.camping_car.cc_type.title'), field: 'vehicleSubtype', arthurHint: t('step.camping_car.cc_type.arthurHint'), options: [
        { value: 'capucine', label: t('step.camping_car.cc_type.opt.capucine.label'), icon: Truck },
        { value: 'integral', label: t('step.camping_car.cc_type.opt.integral.label'), icon: Castle },
        { value: 'fourgon', label: t('step.camping_car.cc_type.opt.fourgon.label'), icon: Car },
      ]},
      { id: 'cc_formule', type: 'card-select', title: t('step.camping_car.cc_formule.title'), field: 'coverageLevel', arthurHint: t('step.camping_car.cc_formule.arthurHint'), options: [
        { value: 'tiers', label: t('step.camping_car.cc_formule.opt.tiers.label'), icon: Shield },
        { value: 'tiers_plus', label: t('step.camping_car.cc_formule.opt.tiers_plus.label'), icon: ShieldCheck },
        { value: 'tous_risques', label: t('step.camping_car.cc_formule.opt.tous_risques.label'), icon: ShieldPlus },
      ]},
      { id: 'cc_usage', type: 'card-select', title: t('step.camping_car.cc_usage.title'), field: 'vehicleUse', arthurHint: t('step.camping_car.cc_usage.arthurHint'), options: [
        { value: 'occasionnel', label: t('step.camping_car.cc_usage.opt.occasionnel.label'), icon: Calendar },
        { value: 'regulier', label: t('step.camping_car.cc_usage.opt.regulier.label'), icon: Activity },
        { value: 'intensif', label: t('step.camping_car.cc_usage.opt.intensif.label'), icon: Award },
      ]},
      vehicleYearStep, ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    sans_permis: [
      { id: 'sp_type', type: 'card-select', title: t('step.sans_permis.sp_type.title'), field: 'vehicleSubtype', arthurHint: t('step.sans_permis.sp_type.arthurHint'), options: [
        { value: 'voiturette', label: t('step.sans_permis.sp_type.opt.voiturette.label'), icon: Car },
        { value: 'scooter', label: t('step.sans_permis.sp_type.opt.scooter.label'), icon: Bike },
        { value: 'autre', label: t('step.sans_permis.sp_type.opt.autre.label'), icon: Activity },
      ]},
      { id: 'sp_formule', type: 'card-select', title: t('step.sans_permis.sp_formule.title'), field: 'coverageLevel', arthurHint: t('step.sans_permis.sp_formule.arthurHint'), options: [
        { value: 'tiers', label: t('step.sans_permis.sp_formule.opt.tiers.label'), icon: Shield },
        { value: 'tiers_plus', label: t('step.sans_permis.sp_formule.opt.tiers_plus.label'), icon: ShieldCheck },
        { value: 'tous_risques', label: t('step.sans_permis.sp_formule.opt.tous_risques.label'), icon: ShieldPlus },
      ]},
      { id: 'sp_conducteur', type: 'card-select', title: t('step.sans_permis.sp_conducteur.title'), field: 'driverProfile', arthurHint: t('step.sans_permis.sp_conducteur.arthurHint'), options: [
        { value: 'jeune', label: t('step.sans_permis.sp_conducteur.opt.jeune.label'), icon: User },
        { value: 'adulte', label: t('step.sans_permis.sp_conducteur.opt.adulte.label'), icon: User },
        { value: 'senior', label: t('step.sans_permis.sp_conducteur.opt.senior.label'), icon: User },
      ]},
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    auto_temporaire: [
      { id: 'at_duree', type: 'card-select', title: t('step.auto_temporaire.at_duree.title'), field: 'duration', arthurHint: t('step.auto_temporaire.at_duree.arthurHint'), options: [
        { value: '1_3j', label: t('step.auto_temporaire.at_duree.opt.1_3j.label'), icon: Clock },
        { value: '4_15j', label: t('step.auto_temporaire.at_duree.opt.4_15j.label'), icon: Calendar },
        { value: '16_90j', label: t('step.auto_temporaire.at_duree.opt.16_90j.label'), icon: Calendar },
      ]},
      { id: 'at_motif', type: 'card-select', title: t('step.auto_temporaire.at_motif.title'), field: 'usage', arthurHint: t('step.auto_temporaire.at_motif.arthurHint'), options: [
        { value: 'voyage', label: t('step.auto_temporaire.at_motif.opt.voyage.label'), icon: Globe },
        { value: 'achat_vente', label: t('step.auto_temporaire.at_motif.opt.achat_vente.label'), icon: Car },
        { value: 'pret_emprunt', label: t('step.auto_temporaire.at_motif.opt.pret_emprunt.label'), icon: KeyRound },
      ]},
      { id: 'at_formule', type: 'card-select', title: t('step.auto_temporaire.at_formule.title'), field: 'coverageLevel', arthurHint: t('step.auto_temporaire.at_formule.arthurHint'), options: [
        { value: 'tiers', label: t('step.auto_temporaire.at_formule.opt.tiers.label'), icon: Shield },
        { value: 'tiers_plus', label: t('step.auto_temporaire.at_formule.opt.tiers_plus.label'), icon: ShieldCheck },
        { value: 'tous_risques', label: t('step.auto_temporaire.at_formule.opt.tous_risques.label'), icon: ShieldPlus },
      ]},
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    flotte: [
      { id: 'fl_taille', type: 'card-select', title: t('step.flotte.fl_taille.title'), field: 'fleetSize', arthurHint: t('step.flotte.fl_taille.arthurHint'), options: [
        { value: '3_5', label: t('step.flotte.fl_taille.opt.3_5.label'), icon: Car },
        { value: '6_20', label: t('step.flotte.fl_taille.opt.6_20.label'), icon: Truck },
        { value: 'sup_20', label: t('step.flotte.fl_taille.opt.sup_20.label'), icon: Building2 },
      ]},
      { id: 'fl_compo', type: 'card-select', title: t('step.flotte.fl_compo.title'), field: 'fleetComposition', arthurHint: t('step.flotte.fl_compo.arthurHint'), options: [
        { value: 'vp', label: t('step.flotte.fl_compo.opt.vp.label'), icon: Car },
        { value: 'utilitaires', label: t('step.flotte.fl_compo.opt.utilitaires.label'), icon: Truck },
        { value: 'mixte', label: t('step.flotte.fl_compo.opt.mixte.label'), icon: Briefcase },
      ]},
      { id: 'fl_usage', type: 'card-select', title: t('step.flotte.fl_usage.title'), field: 'vehicleUse', arthurHint: t('step.flotte.fl_usage.arthurHint'), options: [
        { value: 'tournee', label: t('step.flotte.fl_usage.opt.tournee.label'), icon: Truck },
        { value: 'commercial', label: t('step.flotte.fl_usage.opt.commercial.label'), icon: Briefcase },
        { value: 'mixte', label: t('step.flotte.fl_usage.opt.mixte.label'), icon: Scale },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    cyber: [
      { id: 'cy_taille', type: 'card-select', title: t('step.cyber.cy_taille.title'), field: 'companySize', arthurHint: t('step.cyber.cy_taille.arthurHint'), options: [
        { value: 'tpe', label: t('step.cyber.cy_taille.opt.tpe.label'), icon: User },
        { value: 'pme', label: t('step.cyber.cy_taille.opt.pme.label'), icon: Users },
        { value: 'eti', label: t('step.cyber.cy_taille.opt.eti.label'), icon: Building2 },
      ]},
      { id: 'cy_donnees', type: 'card-select', title: t('step.cyber.cy_donnees.title'), field: 'dataSensitivity', arthurHint: t('step.cyber.cy_donnees.arthurHint'), options: [
        { value: 'oui_clients', label: t('step.cyber.cy_donnees.opt.oui_clients.label'), icon: Database },
        { value: 'oui_sante_fin', label: t('step.cyber.cy_donnees.opt.oui_sante_fin.label'), icon: HeartPulse },
        { value: 'non', label: t('step.cyber.cy_donnees.opt.non.label'), icon: Shield },
      ]},
      { id: 'cy_ca', type: 'card-select', title: t('step.cyber.cy_ca.title'), field: 'revenue', arthurHint: t('step.cyber.cy_ca.arthurHint'), options: [
        { value: 'sub_500k', label: t('step.cyber.cy_ca.opt.sub_500k.label'), icon: Wallet },
        { value: '500k_5m', label: t('step.cyber.cy_ca.opt.500k_5m.label'), icon: Landmark },
        { value: 'sup_5m', label: t('step.cyber.cy_ca.opt.sup_5m.label'), icon: Building2 },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    decennale: [
      { id: 'dc_metier', type: 'card-select', title: t('step.decennale.dc_metier.title'), field: 'activityType', arthurHint: t('step.decennale.dc_metier.arthurHint'), options: [
        { value: 'gros_oeuvre', label: t('step.decennale.dc_metier.opt.gros_oeuvre.label'), icon: HardHat },
        { value: 'second_oeuvre', label: t('step.decennale.dc_metier.opt.second_oeuvre.label'), icon: Hammer },
        { value: 'finition', label: t('step.decennale.dc_metier.opt.finition.label'), icon: Sparkles },
        { value: 'autre', label: t('step.decennale.dc_metier.opt.autre.label'), icon: Building },
      ]},
      { id: 'dc_statut', type: 'card-select', title: t('step.decennale.dc_statut.title'), field: 'legalStatus', arthurHint: t('step.decennale.dc_statut.arthurHint'), options: [
        { value: 'micro', label: t('step.decennale.dc_statut.opt.micro.label'), icon: User },
        { value: 'sasu_eurl', label: t('step.decennale.dc_statut.opt.sasu_eurl.label'), icon: Briefcase },
        { value: 'sas_sarl', label: t('step.decennale.dc_statut.opt.sas_sarl.label'), icon: Building2 },
      ]},
      { id: 'dc_ca', type: 'card-select', title: t('step.decennale.dc_ca.title'), field: 'revenue', arthurHint: t('step.decennale.dc_ca.arthurHint'), options: [
        { value: 'sub_70k', label: t('step.decennale.dc_ca.opt.sub_70k.label'), icon: Wallet },
        { value: '70_250k', label: t('step.decennale.dc_ca.opt.70_250k.label'), icon: Briefcase },
        { value: 'sup_250k', label: t('step.decennale.dc_ca.opt.sup_250k.label'), icon: Building2 },
      ]},
      { id: 'dc_anciennete', type: 'card-select', title: t('step.decennale.dc_anciennete.title'), field: 'experience', arthurHint: t('step.decennale.dc_anciennete.arthurHint'), options: [
        { value: 'creation', label: t('step.decennale.dc_anciennete.opt.creation.label'), icon: Sparkles },
        { value: '1_5', label: t('step.decennale.dc_anciennete.opt.1_5.label'), icon: Activity },
        { value: 'sup_5', label: t('step.decennale.dc_anciennete.opt.sup_5.label'), icon: Award },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    protection_juridique: [
      { id: 'pj_profil', type: 'card-select', title: t('step.protection_juridique.pj_profil.title'), field: 'profile', arthurHint: t('step.protection_juridique.pj_profil.arthurHint'), options: [
        { value: 'particulier', label: t('step.protection_juridique.pj_profil.opt.particulier.label'), icon: User },
        { value: 'pro', label: t('step.protection_juridique.pj_profil.opt.pro.label'), icon: Briefcase },
        { value: 'entreprise', label: t('step.protection_juridique.pj_profil.opt.entreprise.label'), icon: Building2 },
      ]},
      { id: 'pj_domaines', type: 'card-select', title: t('step.protection_juridique.pj_domaines.title'), field: 'coverageScope', arthurHint: t('step.protection_juridique.pj_domaines.arthurHint'), options: [
        { value: 'conso_habitat', label: t('step.protection_juridique.pj_domaines.opt.conso_habitat.label'), icon: Home },
        { value: 'travail', label: t('step.protection_juridique.pj_domaines.opt.travail.label'), icon: FileText },
        { value: 'tous', label: t('step.protection_juridique.pj_domaines.opt.tous.label'), icon: Scale },
      ]},
      { id: 'pj_formule', type: 'card-select', title: t('step.protection_juridique.pj_formule.title'), field: 'coverageLevel', arthurHint: t('step.protection_juridique.pj_formule.arthurHint'), options: [
        { value: 'essentielle', label: t('step.protection_juridique.pj_formule.opt.essentielle.label'), icon: Shield },
        { value: 'confort', label: t('step.protection_juridique.pj_formule.opt.confort.label'), icon: ShieldCheck },
        { value: 'premium', label: t('step.protection_juridique.pj_formule.opt.premium.label'), icon: ShieldPlus },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
    mutuelle_entreprise: [
      { id: 'me_effectif', type: 'card-select', title: t('step.mutuelle_entreprise.me_effectif.title'), field: 'staffSize', arthurHint: t('step.mutuelle_entreprise.me_effectif.arthurHint'), options: [
        { value: '1_5', label: t('step.mutuelle_entreprise.me_effectif.opt.1_5.label'), icon: User },
        { value: '6_20', label: t('step.mutuelle_entreprise.me_effectif.opt.6_20.label'), icon: Users },
        { value: '21_100', label: t('step.mutuelle_entreprise.me_effectif.opt.21_100.label'), icon: Building },
        { value: 'sup_100', label: t('step.mutuelle_entreprise.me_effectif.opt.sup_100.label'), icon: Building2 },
      ]},
      { id: 'me_convention', type: 'card-select', title: t('step.mutuelle_entreprise.me_convention.title'), field: 'collectiveAgreement', arthurHint: t('step.mutuelle_entreprise.me_convention.arthurHint'), options: [
        { value: 'oui_connue', label: t('step.mutuelle_entreprise.me_convention.opt.oui_connue.label'), icon: ShieldCheck },
        { value: 'oui_a_verifier', label: t('step.mutuelle_entreprise.me_convention.opt.oui_a_verifier.label'), icon: Search },
        { value: 'non', label: t('step.mutuelle_entreprise.me_convention.opt.non.label'), icon: AlertTriangle },
      ]},
      { id: 'me_niveau', type: 'card-select', title: t('step.mutuelle_entreprise.me_niveau.title'), field: 'coverageLevel', arthurHint: t('step.mutuelle_entreprise.me_niveau.arthurHint'), options: [
        { value: 'socle_anim', label: t('step.mutuelle_entreprise.me_niveau.opt.socle_anim.label'), icon: Shield },
        { value: 'intermediaire', label: t('step.mutuelle_entreprise.me_niveau.opt.intermediaire.label'), icon: ShieldCheck },
        { value: 'premium', label: t('step.mutuelle_entreprise.me_niveau.opt.premium.label'), icon: ShieldPlus },
      ]},
      postalCodeStep, searchingStep, contactStep,
    ],
  };

};

// Variante isolée de l'étape âge partagée (ageStep, validation 18-99),
// réservée au cyclomoteur 50cc (engineSize === '50') : le BSR/AM s'obtient
// dès 14 ans, un profil que ageStep rejetterait entièrement. N'affecte ni
// ageStep lui-même ni aucune autre verticale — injectée à la volée dans
// MultiStepQuoteForm.tsx uniquement pour ce cas précis (cf. diagnostic du
// 2026-09-12 : aucun mécanisme de step conditionnel générique n'existe dans
// ce fichier, et ce n'est pas l'objet de cet ajout).
export const buildAgeStepMoto50 = (t: TFn): FormStep => ({
  id: 'age',
  type: 'input',
  title: t('step.shared.age.title'),
  subtitle: t('step.shared.age.subtitle'),
  field: 'age',
  arthurHint: t('step.shared.age.arthurHint'),
  inputType: 'number',
  placeholder: t('step.shared.age.placeholder'),
  validation: /^(1[4-9]|[2-9]\d)$/,
  validationMessage: t('step.moto50.age.validation'),
});

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
