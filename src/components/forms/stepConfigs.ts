import { Shield, ShieldCheck, ShieldPlus, Heart, HeartPulse, Activity, Home, Building, Castle, Car, Bike, PawPrint, Briefcase, FileText, Wallet, Landmark, Baby, Users, User, Stethoscope, Pill, Eye, Search, Lock, Scale, Umbrella, ChevronRight, TreePine, Mountain, PartyPopper, HardHat, Award, AlertTriangle, Calendar, Building2, Sparkles, KeyRound, Zap, Truck, Hammer, Clock, Globe, Database } from 'lucide-react';
import mascotBike from '@/assets/mascotte/arthur-bike.png';
import mascotCar from '@/assets/mascotte/arthur-car.webp';
import mascotMoto from '@/assets/mascotte/arthur-moto.webp';
import mascotHouse from '@/assets/mascotte/arthur-house.webp';
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
}

export type InsuranceType = 'auto' | 'moto' | 'habitation' | 'sante' | 'pret' | 'animaux' | 'vie' | 'prevoyance' | 'rc_pro' | 'mrp' | 'gli' | 'pno' | 'comparateur' | 'metiers_atypiques' | 'gestion_locative' | 'velo' | 'camping_car' | 'sans_permis' | 'auto_temporaire' | 'flotte' | 'cyber' | 'decennale' | 'protection_juridique' | 'mutuelle_entreprise';

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
  };

  const vehicleModelStepAuto: FormStep = {
    id: 'vehicleModel',
    type: 'vehicle-select',
    title: t('step.shared.vehicleModel.title'),
    subtitle: t('step.shared.vehicleModel.subtitle'),
    field: 'vehicleModel',
    vehicleType: 'auto',
    vehicleField: 'model',
  };

  const vehicleYearStep: FormStep = {
    id: 'vehicleYear',
    type: 'input',
    title: t('step.shared.vehicleYear.title'),
    subtitle: t('step.shared.vehicleYear.subtitle'),
    field: 'vehicleYear',
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
  };

  const vehicleModelStepMoto: FormStep = {
    id: 'vehicleModel',
    type: 'vehicle-select',
    title: t('step.shared.vehicleModel.title'),
    subtitle: t('step.shared.vehicleModel.subtitle'),
    field: 'vehicleModel',
    vehicleType: 'moto',
    vehicleField: 'model',
  };

  const cs = (it: InsuranceType, sid: string, field: string, opts: StepOption[]): FormStep => ({
    id: sid,
    type: 'card-select',
    title: t(`step.${it}.${sid}.title`),
    subtitle: tt(t, it, sid, 'subtitle'),
    field,
    options: opts,
  });

  return {
    auto: [
      cs('auto', 'formule', 'coverageLevel', [
        opt(t, 'auto', 'formule', 'tiers', Shield),
        opt(t, 'auto', 'formule', 'tiers_plus', ShieldCheck),
        opt(t, 'auto', 'formule', 'tous_risques', ShieldPlus),
      ]),
      vehicleBrandStepAuto,
      vehicleModelStepAuto,
      vehicleYearStep,
      cs('auto', 'usage_auto', 'vehicleUse', [
        opt(t, 'auto', 'usage_auto', 'prive', User),
        opt(t, 'auto', 'usage_auto', 'trajet_travail', Briefcase),
        opt(t, 'auto', 'usage_auto', 'pro', Building2),
      ]),
      cs('auto', 'bonus_malus_auto', 'bonusMalus', [
        opt(t, 'auto', 'bonus_malus_auto', 'bonus_050', Award),
        opt(t, 'auto', 'bonus_malus_auto', 'standard', ShieldCheck),
        opt(t, 'auto', 'bonus_malus_auto', 'malus', AlertTriangle),
      ]),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    moto: [
      cs('moto', 'formule', 'coverageLevel', [
        opt(t, 'moto', 'formule', 'tiers', Shield),
        opt(t, 'moto', 'formule', 'tiers_plus', ShieldCheck),
        opt(t, 'moto', 'formule', 'tous_risques', ShieldPlus),
      ]),
      vehicleBrandStepMoto,
      vehicleModelStepMoto,
      vehicleYearStep,
      cs('moto', 'cylindree_moto', 'engineSize', [
        opt(t, 'moto', 'cylindree_moto', '125', Bike),
        opt(t, 'moto', 'cylindree_moto', 'medium', Bike),
        opt(t, 'moto', 'cylindree_moto', 'large', AlertTriangle),
      ]),
      cs('moto', 'stationnement_moto', 'parkingType', [
        opt(t, 'moto', 'stationnement_moto', 'garage', Lock),
        opt(t, 'moto', 'stationnement_moto', 'parking', Building),
        opt(t, 'moto', 'stationnement_moto', 'rue', AlertTriangle),
      ]),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    habitation: [
      cs('habitation', 'logement', 'housingType', [
        opt(t, 'habitation', 'logement', 'appartement', Building),
        opt(t, 'habitation', 'logement', 'maison', Home),
        opt(t, 'habitation', 'logement', 'villa', Castle),
      ]),
      cs('habitation', 'formule', 'coverageLevel', [
        opt(t, 'habitation', 'formule', 'essentielle', Shield),
        opt(t, 'habitation', 'formule', 'confort', ShieldCheck),
        opt(t, 'habitation', 'formule', 'premium', ShieldPlus),
      ]),
      cs('habitation', 'surface_logement', 'housingSurface', [
        opt(t, 'habitation', 'surface_logement', 'sub_40', Home),
        opt(t, 'habitation', 'surface_logement', '40_90', Building),
        opt(t, 'habitation', 'surface_logement', 'sup_90', Castle),
      ]),
      cs('habitation', 'statut_occupant', 'occupancyStatus', [
        opt(t, 'habitation', 'statut_occupant', 'locataire', KeyRound),
        opt(t, 'habitation', 'statut_occupant', 'proprietaire', Home),
        opt(t, 'habitation', 'statut_occupant', 'coproprietaire', Building2),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    sante: [
      cs('sante', 'situation', 'situation', [
        opt(t, 'sante', 'situation', 'seul', User),
        opt(t, 'sante', 'situation', 'couple', Users),
        opt(t, 'sante', 'situation', 'famille', Baby),
      ]),
      cs('sante', 'besoins', 'coverageLevel', [
        opt(t, 'sante', 'besoins', 'economique', Stethoscope),
        opt(t, 'sante', 'besoins', 'equilibre', Eye),
        opt(t, 'sante', 'besoins', 'integrale', HeartPulse),
      ]),
      cs('sante', 'hospitalisation_sante', 'hospitalCoverage', [
        opt(t, 'sante', 'hospitalisation_sante', 'standard', Stethoscope),
        opt(t, 'sante', 'hospitalisation_sante', 'renforce', ShieldCheck),
        opt(t, 'sante', 'hospitalisation_sante', 'premium', HeartPulse),
      ]),
      cs('sante', 'optique_dentaire', 'opticalDentalNeeds', [
        opt(t, 'sante', 'optique_dentaire', 'faibles', Eye),
        opt(t, 'sante', 'optique_dentaire', 'reguliers', Pill),
        opt(t, 'sante', 'optique_dentaire', 'forts', HeartPulse),
      ]),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    pret: [
      cs('pret', 'garanties', 'coverageLevel', [
        opt(t, 'pret', 'garanties', 'deces', Shield),
        opt(t, 'pret', 'garanties', 'deces_ipt', ShieldCheck),
        opt(t, 'pret', 'garanties', 'deces_ipt_itt', ShieldPlus),
      ]),
      cs('pret', 'montant_pret', 'loanAmount', [
        opt(t, 'pret', 'montant_pret', 'sub_150k', Wallet),
        opt(t, 'pret', 'montant_pret', '150_300k', Landmark),
        opt(t, 'pret', 'montant_pret', 'sup_300k', Building2),
      ]),
      cs('pret', 'fumeur_pret', 'smokerStatus', [
        opt(t, 'pret', 'fumeur_pret', 'non', ShieldCheck),
        opt(t, 'pret', 'fumeur_pret', 'ex', Activity),
        opt(t, 'pret', 'fumeur_pret', 'oui', AlertTriangle),
      ]),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    animaux: [
      cs('animaux', 'animal', 'animalType', [
        opt(t, 'animaux', 'animal', 'chien', PawPrint),
        opt(t, 'animaux', 'animal', 'chat', PawPrint),
        opt(t, 'animaux', 'animal', 'nac', PawPrint),
      ]),
      cs('animaux', 'formule', 'coverageLevel', [
        opt(t, 'animaux', 'formule', 'accident', Activity),
        opt(t, 'animaux', 'formule', 'maladie_accident', HeartPulse),
        opt(t, 'animaux', 'formule', 'integrale', Heart),
      ]),
      cs('animaux', 'age_animal', 'petAge', [
        opt(t, 'animaux', 'age_animal', 'junior', PawPrint),
        opt(t, 'animaux', 'age_animal', 'adult', PawPrint),
        opt(t, 'animaux', 'age_animal', 'senior', HeartPulse),
      ]),
      cs('animaux', 'race_animal', 'petRisk', [
        opt(t, 'animaux', 'race_animal', 'standard', ShieldCheck),
        opt(t, 'animaux', 'race_animal', 'race_sensible', AlertTriangle),
        opt(t, 'animaux', 'race_animal', 'antecedents', Stethoscope),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    vie: [
      cs('vie', 'objectif', 'coverageLevel', [
        opt(t, 'vie', 'objectif', 'epargne', Wallet),
        opt(t, 'vie', 'objectif', 'protection', Umbrella),
        opt(t, 'vie', 'objectif', 'mixte', Landmark),
      ]),
      cs('vie', 'versement_initial', 'initialPayment', [
        opt(t, 'vie', 'versement_initial', 'sub_5k', Wallet),
        opt(t, 'vie', 'versement_initial', '5_50k', Landmark),
        opt(t, 'vie', 'versement_initial', 'sup_50k', Award),
      ]),
      cs('vie', 'horizon_vie', 'investmentHorizon', [
        opt(t, 'vie', 'horizon_vie', 'sub_4', Calendar),
        opt(t, 'vie', 'horizon_vie', '4_8', ShieldCheck),
        opt(t, 'vie', 'horizon_vie', 'sup_8', Sparkles),
      ]),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    prevoyance: [
      cs('prevoyance', 'formule', 'coverageLevel', [
        opt(t, 'prevoyance', 'formule', 'essentielle', Shield),
        opt(t, 'prevoyance', 'formule', 'confort', ShieldCheck),
        opt(t, 'prevoyance', 'formule', 'integrale', ShieldPlus),
      ]),
      cs('prevoyance', 'statut_prevoyance', 'professionalStatus', [
        opt(t, 'prevoyance', 'statut_prevoyance', 'salarie', Briefcase),
        opt(t, 'prevoyance', 'statut_prevoyance', 'tns', User),
        opt(t, 'prevoyance', 'statut_prevoyance', 'dirigeant', Building2),
      ]),
      cs('prevoyance', 'revenu_prevoyance', 'incomeToProtect', [
        opt(t, 'prevoyance', 'revenu_prevoyance', 'sub_2k', Wallet),
        opt(t, 'prevoyance', 'revenu_prevoyance', '2_4k', ShieldCheck),
        opt(t, 'prevoyance', 'revenu_prevoyance', 'sup_4k', Award),
      ]),
      ageStep, postalCodeStep, searchingStep, contactStep,
    ],
    rc_pro: [
      cs('rc_pro', 'activite', 'activityType', [
        opt(t, 'rc_pro', 'activite', 'liberal', Briefcase),
        opt(t, 'rc_pro', 'activite', 'commerce', Scale),
        opt(t, 'rc_pro', 'activite', 'tech', FileText),
      ]),
      cs('rc_pro', 'formule', 'coverageLevel', [
        opt(t, 'rc_pro', 'formule', 'basique', Shield),
        opt(t, 'rc_pro', 'formule', 'standard', ShieldCheck),
        opt(t, 'rc_pro', 'formule', 'premium', ShieldPlus),
      ]),
      cs('rc_pro', 'ca_rcpro', 'revenue', [
        opt(t, 'rc_pro', 'ca_rcpro', 'sub_50k', Wallet),
        opt(t, 'rc_pro', 'ca_rcpro', '50_250k', Briefcase),
        opt(t, 'rc_pro', 'ca_rcpro', 'sup_250k', Building2),
      ]),
      cs('rc_pro', 'clients_rcpro', 'clientType', [
        opt(t, 'rc_pro', 'clients_rcpro', 'particuliers', Users),
        opt(t, 'rc_pro', 'clients_rcpro', 'entreprises', Building2),
        opt(t, 'rc_pro', 'clients_rcpro', 'mixte', Scale),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    mrp: [
      cs('mrp', 'formule', 'coverageLevel', [
        opt(t, 'mrp', 'formule', 'essentielle', Shield),
        opt(t, 'mrp', 'formule', 'confort', ShieldCheck),
        opt(t, 'mrp', 'formule', 'premium', ShieldPlus),
      ]),
      cs('mrp', 'local_mrp', 'businessPremises', [
        opt(t, 'mrp', 'local_mrp', 'bureau', Building),
        opt(t, 'mrp', 'local_mrp', 'commerce', Briefcase),
        opt(t, 'mrp', 'local_mrp', 'atelier', HardHat),
      ]),
      cs('mrp', 'stock_mrp', 'equipmentValue', [
        opt(t, 'mrp', 'stock_mrp', 'sub_10k', Shield),
        opt(t, 'mrp', 'stock_mrp', '10_50k', ShieldCheck),
        opt(t, 'mrp', 'stock_mrp', 'sup_50k', ShieldPlus),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    gli: [
      cs('gli', 'formule', 'coverageLevel', [
        opt(t, 'gli', 'formule', 'basique', Shield),
        opt(t, 'gli', 'formule', 'standard', ShieldCheck),
        opt(t, 'gli', 'formule', 'premium', ShieldPlus),
      ]),
      cs('gli', 'loyer_gli', 'monthlyRent', [
        opt(t, 'gli', 'loyer_gli', 'sub_700', Wallet),
        opt(t, 'gli', 'loyer_gli', '700_1500', Home),
        opt(t, 'gli', 'loyer_gli', 'sup_1500', Building2),
      ]),
      cs('gli', 'locataire_gli', 'tenantStatus', [
        opt(t, 'gli', 'locataire_gli', 'nouveau', Search),
        opt(t, 'gli', 'locataire_gli', 'en_place_ok', ShieldCheck),
        opt(t, 'gli', 'locataire_gli', 'incident', AlertTriangle),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    pno: [
      cs('pno', 'formule', 'coverageLevel', [
        opt(t, 'pno', 'formule', 'essentielle', Shield),
        opt(t, 'pno', 'formule', 'confort', ShieldCheck),
        opt(t, 'pno', 'formule', 'premium', ShieldPlus),
      ]),
      cs('pno', 'occupation_pno', 'propertyOccupancy', [
        opt(t, 'pno', 'occupation_pno', 'loue', KeyRound),
        opt(t, 'pno', 'occupation_pno', 'vacant', Home),
        opt(t, 'pno', 'occupation_pno', 'travaux', HardHat),
      ]),
      cs('pno', 'type_bien_pno', 'propertyType', [
        opt(t, 'pno', 'type_bien_pno', 'appartement', Building),
        opt(t, 'pno', 'type_bien_pno', 'maison', Home),
        opt(t, 'pno', 'type_bien_pno', 'immeuble', Building2),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    gestion_locative: [
      cs('gestion_locative', 'propertyCount', 'propertyCount', [
        opt(t, 'gestion_locative', 'propertyCount', '1', Home),
        opt(t, 'gestion_locative', 'propertyCount', '2-5', Building),
        opt(t, 'gestion_locative', 'propertyCount', '5+', Building2),
      ]),
      cs('gestion_locative', 'managementType', 'managementType', [
        opt(t, 'gestion_locative', 'managementType', 'full', ShieldPlus),
        opt(t, 'gestion_locative', 'managementType', 'partial', ShieldCheck),
        opt(t, 'gestion_locative', 'managementType', 'declaration', FileText),
      ]),
      cs('gestion_locative', 'rentCollection', 'rentCollection', [
        opt(t, 'gestion_locative', 'rentCollection', 'oui', Wallet),
        opt(t, 'gestion_locative', 'rentCollection', 'non', User),
        opt(t, 'gestion_locative', 'rentCollection', 'a_decider', Search),
      ]),
      cs('gestion_locative', 'gli_included', 'includeGLI', [
        opt(t, 'gestion_locative', 'gli_included', 'oui', Lock),
        opt(t, 'gestion_locative', 'gli_included', 'non', FileText),
        opt(t, 'gestion_locative', 'gli_included', 'comparer', Scale),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    comparateur: [
      cs('comparateur', 'type', 'insuranceType', [
        opt(t, 'comparateur', 'type', 'auto', Car, mascotCar),
        opt(t, 'comparateur', 'type', 'moto', Bike, mascotMoto),
        opt(t, 'comparateur', 'type', 'habitation', Home, mascotHouse),
        opt(t, 'comparateur', 'type', 'sante', Heart, mascotSick),
        opt(t, 'comparateur', 'type', 'pno', Building, mascotHouse),
        opt(t, 'comparateur', 'type', 'gli', Lock, mascotDetective),
        opt(t, 'comparateur', 'type', 'vie', Landmark, mascotIdea),
        opt(t, 'comparateur', 'type', 'rc_pro', Briefcase, mascotBusiness),
        opt(t, 'comparateur', 'type', 'prevoyance', Umbrella, mascotInjured),
        opt(t, 'comparateur', 'type', 'pret', FileText, mascotThinking),
        opt(t, 'comparateur', 'type', 'mrp', Building2, mascotBusiness),
        opt(t, 'comparateur', 'type', 'gestion_locative', KeyRound, mascotHouse),
      ]),
      cs('comparateur', 'formule', 'coverageLevel', [
        opt(t, 'comparateur', 'formule', 'essentielle', Shield),
        opt(t, 'comparateur', 'formule', 'confort', ShieldCheck),
        opt(t, 'comparateur', 'formule', 'premium', ShieldPlus),
      ]),
      postalCodeStep, searchingStep, contactStep,
    ],
    metiers_atypiques: [
      cs('metiers_atypiques', 'famille_activite', 'activityFamily', [
        opt(t, 'metiers_atypiques', 'famille_activite', 'parc_aventure', TreePine),
        opt(t, 'metiers_atypiques', 'famille_activite', 'sport_outdoor', Mountain),
        opt(t, 'metiers_atypiques', 'famille_activite', 'evenementiel', PartyPopper),
        opt(t, 'metiers_atypiques', 'famille_activite', 'btp_specialise', HardHat),
        opt(t, 'metiers_atypiques', 'famille_activite', 'autre', Sparkles),
      ]),
      {
        id: 'description_activite',
        type: 'input',
        title: t('step.metiers_atypiques.description_activite.title'),
        subtitle: t('step.metiers_atypiques.description_activite.subtitle'),
        field: 'activityDescription',
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
      ]),
      cs('metiers_atypiques', 'public_encadre', 'publicExposure', [
        opt(t, 'metiers_atypiques', 'public_encadre', 'aucun', Lock),
        opt(t, 'metiers_atypiques', 'public_encadre', 'adultes', User),
        opt(t, 'metiers_atypiques', 'public_encadre', 'mixte', Users),
        opt(t, 'metiers_atypiques', 'public_encadre', 'mineurs', Baby),
      ]),
      cs('metiers_atypiques', 'frequentation', 'attendance', [
        opt(t, 'metiers_atypiques', 'frequentation', 'sub_500', Calendar),
        opt(t, 'metiers_atypiques', 'frequentation', '500_5k', Users),
        opt(t, 'metiers_atypiques', 'frequentation', '5k_50k', Users),
        opt(t, 'metiers_atypiques', 'frequentation', 'sup_50k', PartyPopper),
      ]),
      cs('metiers_atypiques', 'salaries', 'staffSize', [
        opt(t, 'metiers_atypiques', 'salaries', 'solo', User),
        opt(t, 'metiers_atypiques', 'salaries', '2_5', Users),
        opt(t, 'metiers_atypiques', 'salaries', '6_20', Users),
        opt(t, 'metiers_atypiques', 'salaries', 'sup_20', Building2),
      ]),
      cs('metiers_atypiques', 'ca', 'revenue', [
        opt(t, 'metiers_atypiques', 'ca', 'sub_50k', Wallet),
        opt(t, 'metiers_atypiques', 'ca', '50_200k', Wallet),
        opt(t, 'metiers_atypiques', 'ca', '200k_1m', Wallet),
        opt(t, 'metiers_atypiques', 'ca', 'sup_1m', Wallet),
      ]),
      cs('metiers_atypiques', 'certifications', 'certifications', [
        opt(t, 'metiers_atypiques', 'certifications', 'oui_majeures', Award),
        opt(t, 'metiers_atypiques', 'certifications', 'oui_partielles', ShieldCheck),
        opt(t, 'metiers_atypiques', 'certifications', 'non', AlertTriangle),
        opt(t, 'metiers_atypiques', 'certifications', 'en_cours', Activity),
      ]),
      cs('metiers_atypiques', 'sinistres', 'claimsHistory', [
        opt(t, 'metiers_atypiques', 'sinistres', 'aucun', ShieldCheck),
        opt(t, 'metiers_atypiques', 'sinistres', '1_2', Shield),
        opt(t, 'metiers_atypiques', 'sinistres', '3_5', AlertTriangle),
        opt(t, 'metiers_atypiques', 'sinistres', 'sup_5', AlertTriangle),
      ]),
      postalCodeStep,
      {
        id: 'callback',
        type: 'callback',
        title: t('step.metiers_atypiques.callback.title'),
        subtitle: t('step.metiers_atypiques.callback.subtitle'),
      },
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
