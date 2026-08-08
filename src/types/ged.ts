// Types pour `documents` enrichi (contract_id, document_type, valid_until,
// is_required, superseded_by) et la vue documents_manquants. Le sous-ensemble
// historique de colonnes (deal_id, name, status, file_path, drive_url,
// uploaded_at) figure dans src/integrations/supabase/types.ts, mais les
// nouvelles colonnes en sont absentes (généré, périmé — même constat que
// activities/deal_tasks, cf. src/lib/crmApi.ts). Voir src/lib/gedApi.ts pour
// le point de contact unique avec Supabase pour ces colonnes.

export type DocumentType =
  | 'devis'
  | 'conditions_generales'
  | 'conditions_particulieres'
  | 'attestation'
  | 'carte_verte'
  | 'echeancier'
  | 'avenant'
  | 'lettre_resiliation'
  | 'accuse_resiliation'
  | 'releve_information'
  | 'piece_identite'
  | 'justificatif_domicile'
  | 'rib'
  | 'declaration_sinistre'
  | 'rapport_expertise'
  | 'autre';

export const DOCUMENT_TYPES: DocumentType[] = [
  'devis',
  'conditions_generales',
  'conditions_particulieres',
  'attestation',
  'carte_verte',
  'echeancier',
  'avenant',
  'lettre_resiliation',
  'accuse_resiliation',
  'releve_information',
  'piece_identite',
  'justificatif_domicile',
  'rib',
  'declaration_sinistre',
  'rapport_expertise',
  'autre',
];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  devis: 'Devis',
  conditions_generales: 'Conditions générales',
  conditions_particulieres: 'Conditions particulières',
  attestation: 'Attestation',
  carte_verte: 'Carte verte',
  echeancier: 'Échéancier',
  avenant: 'Avenant',
  lettre_resiliation: 'Lettre de résiliation',
  accuse_resiliation: 'Accusé de résiliation',
  releve_information: "Relevé d'information",
  piece_identite: "Pièce d'identité",
  justificatif_domicile: 'Justificatif de domicile',
  rib: 'RIB',
  declaration_sinistre: 'Déclaration de sinistre',
  rapport_expertise: "Rapport d'expertise",
  autre: 'Autre',
};

// doc_status : enum existant côté base (Database["public"]["Enums"]["doc_status"]),
// repris ici tel quel pour ne pas dépendre de types.ts sur cette colonne.
export type DocStatus = 'manquant' | 'attente' | 'valide';

export interface DocumentRow {
  id: string;
  deal_id: string | null;
  contract_id: string | null;
  name: string;
  document_type: DocumentType;
  status: DocStatus;
  file_path: string | null;
  drive_url: string | null;
  valid_until: string | null;
  is_required: boolean;
  superseded_by: string | null;
  notes: string | null;
  uploaded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentInsert {
  deal_id?: string | null;
  contract_id?: string | null;
  name: string;
  document_type: DocumentType;
  status?: DocStatus;
  file_path?: string | null;
  drive_url?: string | null;
  valid_until?: string | null;
  is_required?: boolean;
  superseded_by?: string | null;
  notes?: string | null;
}

// Vue documents_manquants (lecture seule) — une ligne par document
// obligatoire manquant sur un contrat.
export interface DocumentsManquantsRow {
  contract_id: string;
  insurance_type: string;
  full_name: string | null;
  email: string | null;
  document_manquant: string;
}
