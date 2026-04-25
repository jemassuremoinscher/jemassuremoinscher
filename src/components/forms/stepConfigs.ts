import { Shield, ShieldCheck, ShieldPlus, Heart, HeartPulse, Activity, Home, Building, Castle, Car, Bike, PawPrint, Briefcase, FileText, Wallet, Landmark, Baby, Users, User, Stethoscope, Pill, Eye, Search, Lock, Scale, Umbrella, ChevronRight, TreePine, Mountain, PartyPopper, HardHat, Award, AlertTriangle, Calendar, Building2, Sparkles, KeyRound } from 'lucide-react';
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

export type InsuranceType = 'auto' | 'moto' | 'habitation' | 'sante' | 'pret' | 'animaux' | 'vie' | 'prevoyance' | 'rc_pro' | 'mrp' | 'gli' | 'pno' | 'comparateur' | 'metiers_atypiques' | 'gestion_locative';

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

const vehicleBrandStepAuto: FormStep = {
  id: 'vehicleBrand',
  type: 'vehicle-select',
  title: 'Quelle est la marque de votre véhicule ?',
  subtitle: 'Sélectionnez la marque pour affiner votre tarif.',
  field: 'vehicleBrand',
  vehicleType: 'auto',
  vehicleField: 'brand',
};

const vehicleModelStepAuto: FormStep = {
  id: 'vehicleModel',
  type: 'vehicle-select',
  title: 'Quel est le modèle ?',
  subtitle: 'Le modèle influence directement le tarif.',
  field: 'vehicleModel',
  vehicleType: 'auto',
  vehicleField: 'model',
};

const vehicleYearStep: FormStep = {
  id: 'vehicleYear',
  type: 'input',
  title: 'Quelle est l\'année de mise en circulation ?',
  subtitle: 'Plus le véhicule est récent, plus la prime peut varier.',
  field: 'vehicleYear',
  inputType: 'number',
  placeholder: '2020',
  validation: /^(19[89]\d|20[0-2]\d|203[0-6])$/,
  validationMessage: 'Année invalide (1980-2026)',
};

const vehicleBrandStepMoto: FormStep = {
  id: 'vehicleBrand',
  type: 'vehicle-select',
  title: 'Quelle est la marque de votre moto ?',
  subtitle: 'Sélectionnez la marque pour affiner votre tarif.',
  field: 'vehicleBrand',
  vehicleType: 'moto',
  vehicleField: 'brand',
};

const vehicleModelStepMoto: FormStep = {
  id: 'vehicleModel',
  type: 'vehicle-select',
  title: 'Quel est le modèle ?',
  subtitle: 'Le modèle influence directement le tarif.',
  field: 'vehicleModel',
  vehicleType: 'moto',
  vehicleField: 'model',
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
    vehicleBrandStepAuto,
    vehicleModelStepAuto,
    vehicleYearStep,
    {
      id: 'usage_auto',
      type: 'card-select',
      title: 'Quel sera votre usage principal ?',
      subtitle: 'L’usage réel permet d’éviter les estimations trop génériques.',
      field: 'vehicleUse',
      options: [
        { value: 'prive', label: 'Privé', description: 'Trajets personnels', icon: User },
        { value: 'trajet_travail', label: 'Domicile-travail', description: 'Usage quotidien', icon: Briefcase },
        { value: 'pro', label: 'Professionnel', description: 'Déplacements métier', icon: Building2 },
      ],
    },
    {
      id: 'bonus_malus_auto',
      type: 'card-select',
      title: 'Quel est votre bonus-malus actuel ?',
      subtitle: 'Même approximatif, il affine fortement le tarif.',
      field: 'bonusMalus',
      options: [
        { value: 'bonus_050', label: 'Bonus 0,50', description: 'Très bon conducteur', icon: Award },
        { value: 'standard', label: 'Autour de 1,00', description: 'Profil standard', icon: ShieldCheck },
        { value: 'malus', label: 'Malus / résilié', description: 'Profil à défendre', icon: AlertTriangle },
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
    vehicleBrandStepMoto,
    vehicleModelStepMoto,
    vehicleYearStep,
    {
      id: 'cylindree_moto',
      type: 'card-select',
      title: 'Quelle cylindrée correspond le mieux ?',
      subtitle: 'La puissance change fortement la prime moto.',
      field: 'engineSize',
      options: [
        { value: '125', label: '125 cm³', description: 'Scooter ou moto légère', icon: Bike },
        { value: 'medium', label: '126 à 600 cm³', description: 'Usage polyvalent', icon: Bike },
        { value: 'large', label: '+600 cm³', description: 'Grosse cylindrée', icon: AlertTriangle },
      ],
    },
    {
      id: 'stationnement_moto',
      type: 'card-select',
      title: 'Où stationnez-vous le plus souvent ?',
      subtitle: 'Le risque vol dépend beaucoup du stationnement.',
      field: 'parkingType',
      options: [
        { value: 'garage', label: 'Garage fermé', description: 'Risque réduit', icon: Lock },
        { value: 'parking', label: 'Parking privé', description: 'Accès limité', icon: Building },
        { value: 'rue', label: 'Dans la rue', description: 'Protection vol utile', icon: AlertTriangle },
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
  gestion_locative: [
    {
      id: 'propertyCount',
      type: 'card-select',
      title: 'Combien de biens à gérer ?',
      subtitle: 'Plus vous avez de biens, plus les honoraires sont dégressifs.',
      field: 'propertyCount',
      options: [
        { value: '1', label: '1 bien', description: 'Un seul logement', icon: Home },
        { value: '2-5', label: '2 à 5 biens', description: 'Petit portefeuille', icon: Building },
        { value: '5+', label: 'Plus de 5', description: 'Patrimoine important', icon: Building2 },
      ],
    },
    {
      id: 'managementType',
      type: 'card-select',
      title: 'Quel type de gestion ?',
      subtitle: 'Du suivi déclaratif à la gestion clé en main.',
      field: 'managementType',
      options: [
        { value: 'full', label: 'Gestion complète', description: 'Tout délégué : recherche, baux, loyers, travaux', icon: ShieldPlus },
        { value: 'partial', label: 'Gestion partielle', description: 'Quelques tâches déléguées', icon: ShieldCheck },
        { value: 'declaration', label: 'Gestion déclarative', description: 'Suivi administratif & fiscal', icon: FileText },
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
        { value: 'pno', label: 'PNO', description: 'Propriétaire non occupant', icon: Building },
        { value: 'gli', label: 'GLI', description: 'Garantie loyers impayés', icon: Lock },
        { value: 'vie', label: 'Assurance Vie', description: 'Épargne et succession', icon: Landmark },
        { value: 'pret', label: 'Assurance Emprunteur', description: 'Crédit immobilier', icon: FileText },
        { value: 'prevoyance', label: 'Prévoyance', description: 'Décès, invalidité, revenus', icon: Umbrella },
        { value: 'rc_pro', label: 'RC Pro', description: 'Responsabilité professionnelle', icon: Briefcase },
        { value: 'mrp', label: 'MRP', description: 'Locaux et matériel pro', icon: Building2 },
        { value: 'gestion_locative', label: 'Gestion locative', description: 'Honoraires et services bailleur', icon: KeyRound },
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
  metiers_atypiques: [
    {
      id: 'famille_activite',
      type: 'card-select',
      title: 'Quelle famille d\'activité exercez-vous ?',
      subtitle: 'Cela nous oriente vers les bons assureurs spécialisés.',
      field: 'activityFamily',
      options: [
        { value: 'parc_aventure', label: 'Parc accrobranche & aventure', description: 'Tyroliennes, parcours, via ferrata', icon: TreePine },
        { value: 'sport_outdoor', label: 'Sport outdoor & encadrement', description: 'Escalade, kayak, parapente, VTT', icon: Mountain },
        { value: 'evenementiel', label: 'Événementiel & festivals', description: 'Concerts, courses, salons', icon: PartyPopper },
        { value: 'btp_specialise', label: 'BTP spécialisé / hauteur', description: 'Cordistes, élagueurs, désamiantage', icon: HardHat },
        { value: 'autre', label: 'Autre métier atypique', description: 'Drone, food truck, plongée, équestre…', icon: Sparkles },
      ],
    },
    {
      id: 'description_activite',
      type: 'input',
      title: 'Décrivez votre activité en quelques mots',
      subtitle: 'Plus c\'est précis, plus le devis sera juste (ex : « Exploitation parcours acrobatique 8 ateliers »).',
      field: 'activityDescription',
      inputType: 'text',
      placeholder: 'Mon activité principale est…',
      maxLength: 120,
      validation: /^.{10,120}$/,
      validationMessage: '10 caractères minimum, 120 max',
    },
    {
      id: 'statut',
      type: 'card-select',
      title: 'Quel est votre statut juridique ?',
      subtitle: 'Auto-entrepreneur, société, association — chaque cas a son contrat.',
      field: 'legalStatus',
      options: [
        { value: 'micro', label: 'Micro / Auto-ent.', description: 'Indépendant', icon: User },
        { value: 'sasu_eurl', label: 'SASU / EURL', description: 'Société unipersonnelle', icon: Briefcase },
        { value: 'sas_sarl', label: 'SAS / SARL', description: 'Société pluripersonnelle', icon: Building2 },
        { value: 'asso', label: 'Association', description: 'Loi 1901', icon: Users },
      ],
    },
    {
      id: 'public_encadre',
      type: 'card-select',
      title: 'Encadrez-vous du public ?',
      subtitle: 'Le risque corporel des participants est central pour la tarification.',
      field: 'publicExposure',
      options: [
        { value: 'aucun', label: 'Aucun public', description: 'B2B / chantier uniquement', icon: Lock },
        { value: 'adultes', label: 'Adultes uniquement', description: '+18 ans', icon: User },
        { value: 'mixte', label: 'Adultes + enfants', description: 'Familles, scolaires', icon: Users },
        { value: 'mineurs', label: 'Mineurs majoritaires', description: 'Colos, scolaires, clubs', icon: Baby },
      ],
    },
    {
      id: 'frequentation',
      type: 'card-select',
      title: 'Quelle fréquentation annuelle ?',
      subtitle: 'Nombre cumulé de participants/visiteurs sur 12 mois.',
      field: 'attendance',
      options: [
        { value: 'sub_500', label: 'Moins de 500', description: 'Activité ponctuelle', icon: Calendar },
        { value: '500_5k', label: '500 — 5 000', description: 'Petite structure', icon: Users },
        { value: '5k_50k', label: '5 000 — 50 000', description: 'Structure établie', icon: Users },
        { value: 'sup_50k', label: '+ de 50 000', description: 'Gros événement / parc', icon: PartyPopper },
      ],
    },
    {
      id: 'salaries',
      type: 'card-select',
      title: 'Combien de personnes interviennent ?',
      subtitle: 'Salariés + indépendants + bénévoles encadrants.',
      field: 'staffSize',
      options: [
        { value: 'solo', label: 'Solo', description: 'Juste moi', icon: User },
        { value: '2_5', label: '2 à 5', description: 'Petite équipe', icon: Users },
        { value: '6_20', label: '6 à 20', description: 'Équipe structurée', icon: Users },
        { value: 'sup_20', label: '+ de 20', description: 'Grosse structure', icon: Building2 },
      ],
    },
    {
      id: 'ca',
      type: 'card-select',
      title: 'Quel chiffre d\'affaires annuel ?',
      subtitle: 'CA HT du dernier exercice (ou prévisionnel pour une création).',
      field: 'revenue',
      options: [
        { value: 'sub_50k', label: 'Moins de 50 k€', description: 'Démarrage', icon: Wallet },
        { value: '50_200k', label: '50 — 200 k€', description: 'Croissance', icon: Wallet },
        { value: '200k_1m', label: '200 k€ — 1 M€', description: 'Établi', icon: Wallet },
        { value: 'sup_1m', label: '+ de 1 M€', description: 'Grosse structure', icon: Wallet },
      ],
    },
    {
      id: 'certifications',
      type: 'card-select',
      title: 'Avez-vous des certifications professionnelles ?',
      subtitle: 'Elles divisent souvent la prime par 2. Cochez le plus représentatif.',
      field: 'certifications',
      options: [
        { value: 'oui_majeures', label: 'Oui (IRATA, BPJEPS, ECP…)', description: 'Certifs sectorielles à jour', icon: Award },
        { value: 'oui_partielles', label: 'Partielles', description: 'Quelques diplômes / formations', icon: ShieldCheck },
        { value: 'non', label: 'Aucune formelle', description: 'Expérience uniquement', icon: AlertTriangle },
        { value: 'en_cours', label: 'En cours d\'obtention', description: 'Formation active', icon: Activity },
      ],
    },
    {
      id: 'sinistres',
      type: 'card-select',
      title: 'Sinistres déclarés sur les 5 dernières années ?',
      subtitle: 'L\'honnêteté joue en votre faveur — nous le savons valoriser.',
      field: 'claimsHistory',
      options: [
        { value: 'aucun', label: 'Aucun sinistre', description: 'Historique vierge', icon: ShieldCheck },
        { value: '1_2', label: '1 à 2 sinistres', description: 'Faible sinistralité', icon: Shield },
        { value: '3_5', label: '3 à 5 sinistres', description: 'À expliquer', icon: AlertTriangle },
        { value: 'sup_5', label: '+ de 5 ou refus', description: 'On défend votre dossier', icon: AlertTriangle },
      ],
    },
    postalCodeStep,
    {
      id: 'callback',
      type: 'callback',
      title: 'Votre dossier mérite une étude personnalisée',
      subtitle: 'Pour les métiers atypiques, aucune grille standard ne donne de prix juste. Un courtier expert vous rappelle sous 30 minutes avec une estimation argumentée et 2 à 3 propositions de nos 20 assureurs de niche.',
    },
  ],
};
