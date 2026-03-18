import { Shield, ShieldCheck, ShieldPlus, Heart, HeartPulse, Activity, Home, Building, Castle, Car, Bike, PawPrint, Briefcase, FileText, Wallet, Landmark, Baby, Users, User, Stethoscope, Pill, Eye, Search, Lock, Scale, Umbrella, ChevronRight } from 'lucide-react';

export interface StepOption {
  value: string;
  label: string;
  description?: string;
  icon: any;
}

export interface FormStep {
  id: string;
  type: 'card-select' | 'input' | 'searching' | 'contact';
  title: string;
  subtitle?: string;
  field?: string;
  options?: StepOption[];
  inputType?: string;
  placeholder?: string;
  maxLength?: number;
  validation?: RegExp;
  validationMessage?: string;
}

export type InsuranceType = 'auto' | 'moto' | 'habitation' | 'sante' | 'pret' | 'animaux' | 'vie' | 'prevoyance' | 'rc_pro' | 'mrp' | 'gli' | 'pno' | 'comparateur';

// Mascot mapping per insurance type
export const mascotMap: Record<InsuranceType, string> = {
  auto: '/src/assets/mascotte/arthur-car.png',
  moto: '/src/assets/mascotte/arthur-moto.png',
  habitation: '/src/assets/mascotte/arthur-house.png',
  sante: '/src/assets/mascotte/arthur-sick.png',
  pret: '/src/assets/mascotte/arthur-thinking.png',
  animaux: '/src/assets/mascotte/arthur-animals.png',
  vie: '/src/assets/mascotte/arthur-idea.png',
  prevoyance: '/src/assets/mascotte/arthur-injured.png',
  rc_pro: '/src/assets/mascotte/arthur-business.png',
  mrp: '/src/assets/mascotte/arthur-business.png',
  gli: '/src/assets/mascotte/arthur-detective.png',
  pno: '/src/assets/mascotte/arthur-house.png',
  comparateur: '/src/assets/mascotte/arthur-thumbs-up.png',
};

const searchingStep: FormStep = {
  id: 'searching',
  type: 'searching',
  title: 'Recherche en cours…',
  subtitle: 'Nous comparons les offres de 50+ assureurs partenaires pour vous trouver le meilleur tarif.',
};

const contactStep: FormStep = {
  id: 'contact',
  type: 'contact',
  title: 'Recevez votre devis personnalisé',
  subtitle: 'Un conseiller vous rappelle sous 30 minutes avec les meilleures offres.',
};

const postalCodeStep: FormStep = {
  id: 'postalCode',
  type: 'input',
  title: 'Quel est votre code postal ?',
  subtitle: 'Les tarifs varient selon votre lieu de résidence.',
  field: 'postalCode',
  inputType: 'text',
  placeholder: '75001',
  maxLength: 5,
  validation: /^\d{5}$/,
  validationMessage: 'Code postal invalide (5 chiffres)',
};

const ageStep: FormStep = {
  id: 'age',
  type: 'input',
  title: 'Quel est votre âge ?',
  subtitle: 'Votre âge influence directement le tarif de votre assurance.',
  field: 'age',
  inputType: 'number',
  placeholder: '30',
  validation: /^(1[89]|[2-9]\d)$/,
  validationMessage: 'Âge invalide (18-99)',
};

export const stepConfigsByType: Record<InsuranceType, FormStep[]> = {
  auto: [
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quelle formule recherchez-vous ?',
      subtitle: 'Choisissez le niveau de protection adapté à vos besoins.',
      field: 'coverageLevel',
      options: [
        { value: 'tiers', label: 'Tiers', description: 'Protection de base au meilleur prix', icon: Shield },
        { value: 'tiers_plus', label: 'Tiers +', description: 'Bris de glace, vol et incendie inclus', icon: ShieldCheck },
        { value: 'tous_risques', label: 'Tous Risques', description: 'Protection maximale tous dommages', icon: ShieldPlus },
      ],
    },
    ageStep,
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  moto: [
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quelle formule moto souhaitez-vous ?',
      subtitle: 'Protégez votre 2 roues selon votre usage.',
      field: 'coverageLevel',
      options: [
        { value: 'tiers', label: 'Tiers', description: 'Responsabilité civile obligatoire', icon: Shield },
        { value: 'tiers_plus', label: 'Tiers +', description: 'Vol, incendie et équipement pilote', icon: ShieldCheck },
        { value: 'tous_risques', label: 'Tous Risques', description: 'Protection complète pilote et moto', icon: ShieldPlus },
      ],
    },
    ageStep,
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  habitation: [
    {
      id: 'logement',
      type: 'card-select',
      title: 'Quel type de logement assurez-vous ?',
      subtitle: 'Nous adapterons les garanties à votre logement.',
      field: 'housingType',
      options: [
        { value: 'appartement', label: 'Appartement', description: 'En copropriété', icon: Building },
        { value: 'maison', label: 'Maison', description: 'Individuelle ou mitoyenne', icon: Home },
        { value: 'villa', label: 'Villa / Prestige', description: 'Grande surface ou villa', icon: Castle },
      ],
    },
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de couverture ?',
      field: 'coverageLevel',
      options: [
        { value: 'essentielle', label: 'Essentielle', description: 'Les garanties indispensables', icon: Shield },
        { value: 'confort', label: 'Confort', description: 'Rééquipement à neuf, vol inclus', icon: ShieldCheck },
        { value: 'premium', label: 'Premium', description: 'Couverture maximale et objets de valeur', icon: ShieldPlus },
      ],
    },
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  sante: [
    {
      id: 'situation',
      type: 'card-select',
      title: 'Quelle est votre situation ?',
      subtitle: 'Les besoins en santé varient selon votre profil.',
      field: 'situation',
      options: [
        { value: 'seul', label: 'Seul(e)', description: 'Couverture individuelle', icon: User },
        { value: 'couple', label: 'En couple', description: 'Couverture pour 2 personnes', icon: Users },
        { value: 'famille', label: 'Famille', description: 'Avec enfants à charge', icon: Baby },
      ],
    },
    {
      id: 'besoins',
      type: 'card-select',
      title: 'Quels sont vos besoins prioritaires ?',
      field: 'coverageLevel',
      options: [
        { value: 'economique', label: 'Économique', description: 'Soins courants remboursés', icon: Stethoscope },
        { value: 'equilibre', label: 'Équilibre', description: 'Dentaire et optique renforcés', icon: Eye },
        { value: 'integrale', label: 'Intégrale', description: 'Médecines douces et hospitalisation premium', icon: HeartPulse },
      ],
    },
    ageStep,
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  pret: [
    {
      id: 'garanties',
      type: 'card-select',
      title: 'Quelles garanties souhaitez-vous ?',
      subtitle: 'Protégez votre emprunt et vos proches.',
      field: 'coverageLevel',
      options: [
        { value: 'deces', label: 'Décès', description: 'Garantie décès de base', icon: Shield },
        { value: 'deces_ipt', label: 'Décès + IPT', description: 'Invalidité permanente totale incluse', icon: ShieldCheck },
        { value: 'deces_ipt_itt', label: 'Décès + IPT + ITT', description: 'Incapacité temporaire incluse', icon: ShieldPlus },
      ],
    },
    ageStep,
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  animaux: [
    {
      id: 'animal',
      type: 'card-select',
      title: 'Quel animal souhaitez-vous assurer ?',
      subtitle: 'Protégez votre compagnon à 4 pattes.',
      field: 'animalType',
      options: [
        { value: 'chien', label: 'Chien', description: 'Toutes races', icon: PawPrint },
        { value: 'chat', label: 'Chat', description: 'Intérieur ou extérieur', icon: PawPrint },
        { value: 'nac', label: 'NAC', description: 'Lapin, furet, reptile…', icon: PawPrint },
      ],
    },
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de protection ?',
      field: 'coverageLevel',
      options: [
        { value: 'accident', label: 'Accidents', description: 'Chirurgie et urgences', icon: Activity },
        { value: 'maladie_accident', label: 'Maladie + Accident', description: 'Consultations et soins inclus', icon: HeartPulse },
        { value: 'integrale', label: 'Intégrale', description: 'Prévention, vaccins et stérilisation', icon: Heart },
      ],
    },
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  vie: [
    {
      id: 'objectif',
      type: 'card-select',
      title: 'Quel est votre objectif principal ?',
      subtitle: 'Nous adapterons nos recommandations.',
      field: 'coverageLevel',
      options: [
        { value: 'epargne', label: 'Épargne', description: 'Fructifier votre capital', icon: Wallet },
        { value: 'protection', label: 'Protection', description: 'Protéger vos proches', icon: Umbrella },
        { value: 'mixte', label: 'Mixte', description: 'Épargne + protection décès', icon: Landmark },
      ],
    },
    ageStep,
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  prevoyance: [
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de prévoyance ?',
      subtitle: 'Anticipez les imprévus de la vie.',
      field: 'coverageLevel',
      options: [
        { value: 'essentielle', label: 'Essentielle', description: 'Décès et invalidité', icon: Shield },
        { value: 'confort', label: 'Confort', description: '+ Incapacité temporaire', icon: ShieldCheck },
        { value: 'integrale', label: 'Intégrale', description: '+ Dépendance et hospitalisation', icon: ShieldPlus },
      ],
    },
    ageStep,
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  rc_pro: [
    {
      id: 'activite',
      type: 'card-select',
      title: 'Quel est votre type d\'activité ?',
      subtitle: 'Les garanties dépendent de votre métier.',
      field: 'activityType',
      options: [
        { value: 'liberal', label: 'Libéral', description: 'Profession libérale ou indépendante', icon: Briefcase },
        { value: 'commerce', label: 'Commerce', description: 'Vente de biens ou services', icon: Scale },
        { value: 'tech', label: 'Tech / Conseil', description: 'IT, conseil, formation', icon: FileText },
      ],
    },
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de couverture RC Pro ?',
      field: 'coverageLevel',
      options: [
        { value: 'basique', label: 'Basique', description: 'RC Pro obligatoire', icon: Shield },
        { value: 'standard', label: 'Standard', description: '+ Protection juridique', icon: ShieldCheck },
        { value: 'premium', label: 'Premium', description: '+ Cyber-risques et perte d\'exploitation', icon: ShieldPlus },
      ],
    },
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  mrp: [
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de couverture MRP ?',
      subtitle: 'Protégez vos locaux professionnels.',
      field: 'coverageLevel',
      options: [
        { value: 'essentielle', label: 'Essentielle', description: 'Incendie, dégâts des eaux', icon: Shield },
        { value: 'confort', label: 'Confort', description: '+ Vol et bris de machines', icon: ShieldCheck },
        { value: 'premium', label: 'Premium', description: '+ Perte d\'exploitation', icon: ShieldPlus },
      ],
    },
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  gli: [
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de GLI souhaitez-vous ?',
      subtitle: 'Garantie loyers impayés pour propriétaires bailleurs.',
      field: 'coverageLevel',
      options: [
        { value: 'basique', label: 'Basique', description: 'Loyers impayés uniquement', icon: Shield },
        { value: 'standard', label: 'Standard', description: '+ Détériorations immobilières', icon: ShieldCheck },
        { value: 'premium', label: 'Premium', description: '+ Protection juridique et vacance locative', icon: ShieldPlus },
      ],
    },
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  pno: [
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de couverture PNO ?',
      subtitle: 'Protégez votre bien non occupé.',
      field: 'coverageLevel',
      options: [
        { value: 'essentielle', label: 'Essentielle', description: 'Responsabilité civile propriétaire', icon: Shield },
        { value: 'confort', label: 'Confort', description: '+ Dégâts des eaux, incendie', icon: ShieldCheck },
        { value: 'premium', label: 'Premium', description: '+ Vol et recours des locataires', icon: ShieldPlus },
      ],
    },
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
  comparateur: [
    {
      id: 'type',
      type: 'card-select',
      title: 'Que souhaitez-vous assurer ?',
      subtitle: 'Nous comparerons 50+ offres pour vous.',
      field: 'insuranceType',
      options: [
        { value: 'auto', label: 'Auto', description: 'Voiture et utilitaire', icon: Car },
        { value: 'moto', label: 'Moto', description: '2 roues et scooter', icon: Bike },
        { value: 'habitation', label: 'Habitation', description: 'Maison ou appartement', icon: Home },
        { value: 'sante', label: 'Santé', description: 'Mutuelle et complémentaire', icon: Heart },
      ],
    },
    {
      id: 'formule',
      type: 'card-select',
      title: 'Quel niveau de couverture ?',
      field: 'coverageLevel',
      options: [
        { value: 'essentielle', label: 'Essentielle', description: 'Le strict nécessaire, prix mini', icon: Shield },
        { value: 'confort', label: 'Confort', description: 'Le meilleur rapport qualité-prix', icon: ShieldCheck },
        { value: 'premium', label: 'Premium', description: 'La couverture maximale', icon: ShieldPlus },
      ],
    },
    postalCodeStep,
    searchingStep,
    contactStep,
  ],
};
