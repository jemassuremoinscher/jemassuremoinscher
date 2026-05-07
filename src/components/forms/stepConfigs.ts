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
    {
      id: 'surface_logement',
      type: 'card-select',
      title: 'Quelle est la surface du logement ?',
      subtitle: 'Surface et valeur du mobilier calibrent le niveau de garantie.',
      field: 'housingSurface',
      options: [
        { value: 'sub_40', label: 'Moins de 40 m²', description: 'Studio / T2', icon: Home },
        { value: '40_90', label: '40 à 90 m²', description: 'Appartement familial', icon: Building },
        { value: 'sup_90', label: '+ de 90 m²', description: 'Grande surface', icon: Castle },
      ],
    },
    {
      id: 'statut_occupant',
      type: 'card-select',
      title: 'Vous êtes locataire ou propriétaire ?',
      subtitle: 'Les obligations ne sont pas les mêmes selon votre statut.',
      field: 'occupancyStatus',
      options: [
        { value: 'locataire', label: 'Locataire', description: 'MRH obligatoire', icon: KeyRound },
        { value: 'proprietaire', label: 'Propriétaire occupant', description: 'Protection du bien', icon: Home },
        { value: 'coproprietaire', label: 'Copropriétaire', description: 'Complément copropriété', icon: Building2 },
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
    {
      id: 'hospitalisation_sante',
      type: 'card-select',
      title: 'Quel niveau d’hospitalisation voulez-vous ?',
      subtitle: 'Chambre particulière et dépassements changent le prix final.',
      field: 'hospitalCoverage',
      options: [
        { value: 'standard', label: 'Standard', description: 'Frais essentiels', icon: Stethoscope },
        { value: 'renforce', label: 'Renforcé', description: 'Dépassements modérés', icon: ShieldCheck },
        { value: 'premium', label: 'Premium', description: 'Chambre particulière', icon: HeartPulse },
      ],
    },
    {
      id: 'optique_dentaire',
      type: 'card-select',
      title: 'Optique et dentaire : quels besoins ?',
      subtitle: 'Deux postes souvent décisifs dans le choix d’une mutuelle.',
      field: 'opticalDentalNeeds',
      options: [
        { value: 'faibles', label: 'Faibles', description: 'Contrôles ponctuels', icon: Eye },
        { value: 'reguliers', label: 'Réguliers', description: 'Lunettes ou soins prévus', icon: Pill },
        { value: 'forts', label: 'Importants', description: 'Implants, orthodontie, verres', icon: HeartPulse },
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
    {
      id: 'montant_pret',
      type: 'card-select',
      title: 'Quel capital reste à assurer ?',
      subtitle: 'Le montant restant dû est indispensable pour estimer l’économie.',
      field: 'loanAmount',
      options: [
        { value: 'sub_150k', label: '< 150 k€', description: 'Petit capital', icon: Wallet },
        { value: '150_300k', label: '150 à 300 k€', description: 'Crédit courant', icon: Landmark },
        { value: 'sup_300k', label: '+ de 300 k€', description: 'Capital élevé', icon: Building2 },
      ],
    },
    {
      id: 'fumeur_pret',
      type: 'card-select',
      title: 'Êtes-vous fumeur ?',
      subtitle: 'Ce critère modifie fortement le taux d’assurance emprunteur.',
      field: 'smokerStatus',
      options: [
        { value: 'non', label: 'Non-fumeur', description: 'Meilleur taux possible', icon: ShieldCheck },
        { value: 'ex', label: 'Ex-fumeur', description: 'Arrêt récent ou ancien', icon: Activity },
        { value: 'oui', label: 'Fumeur', description: 'Tarif adapté', icon: AlertTriangle },
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
    {
      id: 'age_animal',
      type: 'card-select',
      title: 'Quel âge a votre animal ?',
      subtitle: 'L’âge influence les garanties disponibles et les exclusions.',
      field: 'petAge',
      options: [
        { value: 'junior', label: 'Moins de 2 ans', description: 'Prévention utile', icon: PawPrint },
        { value: 'adult', label: '2 à 7 ans', description: 'Profil standard', icon: PawPrint },
        { value: 'senior', label: '+ de 7 ans', description: 'Couverture renforcée', icon: HeartPulse },
      ],
    },
    {
      id: 'race_animal',
      type: 'card-select',
      title: 'Votre animal a-t-il un risque particulier ?',
      subtitle: 'Certaines races ou antécédents nécessitent une formule adaptée.',
      field: 'petRisk',
      options: [
        { value: 'standard', label: 'Aucun connu', description: 'Profil classique', icon: ShieldCheck },
        { value: 'race_sensible', label: 'Race sensible', description: 'Fragilités fréquentes', icon: AlertTriangle },
        { value: 'antecedents', label: 'Antécédents', description: 'Déjà suivi par un vétérinaire', icon: Stethoscope },
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
    {
      id: 'versement_initial',
      type: 'card-select',
      title: 'Quel versement initial envisagez-vous ?',
      subtitle: 'Cela permet de comparer les contrats adaptés à votre enveloppe.',
      field: 'initialPayment',
      options: [
        { value: 'sub_5k', label: '< 5 000 €', description: 'Démarrage progressif', icon: Wallet },
        { value: '5_50k', label: '5 000 à 50 000 €', description: 'Allocation équilibrée', icon: Landmark },
        { value: 'sup_50k', label: '+ de 50 000 €', description: 'Gestion patrimoniale', icon: Award },
      ],
    },
    {
      id: 'horizon_vie',
      type: 'card-select',
      title: 'Quel est votre horizon de placement ?',
      subtitle: 'La durée oriente fonds euros, unités de compte et fiscalité.',
      field: 'investmentHorizon',
      options: [
        { value: 'sub_4', label: '< 4 ans', description: 'Disponibilité prioritaire', icon: Calendar },
        { value: '4_8', label: '4 à 8 ans', description: 'Équilibre rendement/risque', icon: ShieldCheck },
        { value: 'sup_8', label: '+ de 8 ans', description: 'Fiscalité optimisée', icon: Sparkles },
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
    {
      id: 'statut_prevoyance',
      type: 'card-select',
      title: 'Quel est votre statut professionnel ?',
      subtitle: 'Salarié, TNS ou dirigeant : les besoins de maintien de revenu changent.',
      field: 'professionalStatus',
      options: [
        { value: 'salarie', label: 'Salarié', description: 'Complément employeur possible', icon: Briefcase },
        { value: 'tns', label: 'TNS / indépendant', description: 'Protection à renforcer', icon: User },
        { value: 'dirigeant', label: 'Dirigeant', description: 'Revenus à sécuriser', icon: Building2 },
      ],
    },
    {
      id: 'revenu_prevoyance',
      type: 'card-select',
      title: 'Quel revenu mensuel souhaitez-vous protéger ?',
      subtitle: 'La rente ou indemnité journalière dépend du revenu assuré.',
      field: 'incomeToProtect',
      options: [
        { value: 'sub_2k', label: '< 2 000 €', description: 'Protection essentielle', icon: Wallet },
        { value: '2_4k', label: '2 000 à 4 000 €', description: 'Revenu moyen', icon: ShieldCheck },
        { value: 'sup_4k', label: '+ de 4 000 €', description: 'Couverture renforcée', icon: Award },
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
    {
      id: 'ca_rcpro',
      type: 'card-select',
      title: 'Quel est votre chiffre d’affaires annuel ?',
      subtitle: 'Le chiffre d’affaires détermine souvent le plafond conseillé.',
      field: 'revenue',
      options: [
        { value: 'sub_50k', label: '< 50 k€', description: 'Création ou petite activité', icon: Wallet },
        { value: '50_250k', label: '50 à 250 k€', description: 'Activité installée', icon: Briefcase },
        { value: 'sup_250k', label: '+ de 250 k€', description: 'Exposition plus forte', icon: Building2 },
      ],
    },
    {
      id: 'clients_rcpro',
      type: 'card-select',
      title: 'Travaillez-vous surtout avec des particuliers ou des entreprises ?',
      subtitle: 'Le type de client influe sur les risques de réclamation.',
      field: 'clientType',
      options: [
        { value: 'particuliers', label: 'Particuliers', description: 'B2C', icon: Users },
        { value: 'entreprises', label: 'Entreprises', description: 'B2B', icon: Building2 },
        { value: 'mixte', label: 'Mixte', description: 'B2B et B2C', icon: Scale },
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
    {
      id: 'local_mrp',
      type: 'card-select',
      title: 'Quel type de local professionnel assurez-vous ?',
      subtitle: 'Commerce, bureau ou atelier n’ont pas la même exposition.',
      field: 'businessPremises',
      options: [
        { value: 'bureau', label: 'Bureau', description: 'Faible stock', icon: Building },
        { value: 'commerce', label: 'Commerce', description: 'Clientèle et stock', icon: Briefcase },
        { value: 'atelier', label: 'Atelier / entrepôt', description: 'Matériel et machines', icon: HardHat },
      ],
    },
    {
      id: 'stock_mrp',
      type: 'card-select',
      title: 'Quelle valeur de stock ou matériel couvrir ?',
      subtitle: 'Cette valeur ajuste les garanties vol, incendie et bris.',
      field: 'equipmentValue',
      options: [
        { value: 'sub_10k', label: '< 10 k€', description: 'Matériel léger', icon: Shield },
        { value: '10_50k', label: '10 à 50 k€', description: 'Stock significatif', icon: ShieldCheck },
        { value: 'sup_50k', label: '+ de 50 k€', description: 'Protection renforcée', icon: ShieldPlus },
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
    {
      id: 'loyer_gli',
      type: 'card-select',
      title: 'Quel est le loyer mensuel charges comprises ?',
      subtitle: 'La cotisation GLI est calculée en pourcentage du loyer.',
      field: 'monthlyRent',
      options: [
        { value: 'sub_700', label: '< 700 €', description: 'Petit loyer', icon: Wallet },
        { value: '700_1500', label: '700 à 1 500 €', description: 'Loyer courant', icon: Home },
        { value: 'sup_1500', label: '+ de 1 500 €', description: 'Bien premium', icon: Building2 },
      ],
    },
    {
      id: 'locataire_gli',
      type: 'card-select',
      title: 'Le locataire est-il déjà en place ?',
      subtitle: 'Les conditions d’éligibilité diffèrent selon le bail.',
      field: 'tenantStatus',
      options: [
        { value: 'nouveau', label: 'Nouveau locataire', description: 'Dossier à valider', icon: Search },
        { value: 'en_place_ok', label: 'En place sans incident', description: 'Historique favorable', icon: ShieldCheck },
        { value: 'incident', label: 'Incident récent', description: 'Étude nécessaire', icon: AlertTriangle },
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
    {
      id: 'occupation_pno',
      type: 'card-select',
      title: 'Le logement est-il occupé ?',
      subtitle: 'Vacance, location ou travaux modifient les garanties nécessaires.',
      field: 'propertyOccupancy',
      options: [
        { value: 'loue', label: 'Loué', description: 'Locataire en place', icon: KeyRound },
        { value: 'vacant', label: 'Vacant', description: 'Entre deux locations', icon: Home },
        { value: 'travaux', label: 'En travaux', description: 'Risque spécifique', icon: HardHat },
      ],
    },
    {
      id: 'type_bien_pno',
      type: 'card-select',
      title: 'Quel type de bien possédez-vous ?',
      subtitle: 'Appartement, maison ou immeuble : les garanties diffèrent.',
      field: 'propertyType',
      options: [
        { value: 'appartement', label: 'Appartement', description: 'Copropriété', icon: Building },
        { value: 'maison', label: 'Maison', description: 'Bien individuel', icon: Home },
        { value: 'immeuble', label: 'Immeuble', description: 'Plusieurs lots', icon: Building2 },
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
    {
      id: 'rentCollection',
      type: 'card-select',
      title: 'Souhaitez-vous inclure l’encaissement des loyers ?',
      subtitle: 'Ce service modifie le niveau d’honoraires et le suivi mensuel.',
      field: 'rentCollection',
      options: [
        { value: 'oui', label: 'Oui', description: 'Encaissement complet', icon: Wallet },
        { value: 'non', label: 'Non', description: 'Je garde cette partie', icon: User },
        { value: 'a_decider', label: 'À décider', description: 'Comparer les deux', icon: Search },
      ],
    },
    {
      id: 'gli_included',
      type: 'card-select',
      title: 'Voulez-vous intégrer une garantie loyers impayés ?',
      subtitle: 'La GLI peut être couplée à la gestion pour sécuriser les revenus.',
      field: 'includeGLI',
      options: [
        { value: 'oui', label: 'Oui', description: 'Revenus sécurisés', icon: Lock },
        { value: 'non', label: 'Non', description: 'Gestion seule', icon: FileText },
        { value: 'comparer', label: 'Comparer', description: 'Avec et sans GLI', icon: Scale },
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
        { value: 'auto', label: 'Auto', description: 'Voiture et utilitaire', icon: Car, iconImage: mascotCar },
        { value: 'moto', label: 'Moto', description: '2 roues et scooter', icon: Bike, iconImage: mascotMoto },
        { value: 'habitation', label: 'Habitation', description: 'Maison ou appartement', icon: Home, iconImage: mascotHouse },
        { value: 'sante', label: 'Santé', description: 'Mutuelle et complémentaire', icon: Heart, iconImage: mascotSick },
        { value: 'pno', label: 'PNO', description: 'Propriétaire non occupant', icon: Building, iconImage: mascotHouse },
        { value: 'gli', label: 'GLI', description: 'Garantie loyers impayés', icon: Lock, iconImage: mascotDetective },
        { value: 'vie', label: 'Assurance Vie', description: 'Épargne et succession', icon: Landmark, iconImage: mascotIdea },
        { value: 'pret', label: 'Assurance Emprunteur', description: 'Crédit immobilier', icon: FileText, iconImage: mascotThinking },
        { value: 'prevoyance', label: 'Prévoyance', description: 'Décès, invalidité, revenus', icon: Umbrella, iconImage: mascotInjured },
        { value: 'rc_pro', label: 'RC Pro', description: 'Responsabilité professionnelle', icon: Briefcase, iconImage: mascotBusiness },
        { value: 'mrp', label: 'MRP', description: 'Locaux et matériel pro', icon: Building2, iconImage: mascotBusiness },
        { value: 'gestion_locative', label: 'Gestion locative', description: 'Honoraires et services bailleur', icon: KeyRound, iconImage: mascotHouse },
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
