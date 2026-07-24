export const STAGES = [
  { id: "lead", label: "Lead", tone: "#F5F3FF", accent: "#7C3AED" },
  { id: "qualified", label: "Qualifié", tone: "#EEF2FF", accent: "#4F46E5" },
  { id: "quote_sent", label: "Devis envoyé", tone: "#ECFEFF", accent: "#0891B2" },
  { id: "subscription", label: "Souscription", tone: "#FEF3C7", accent: "#D97706" },
  { id: "incomplete", label: "Dossier incomplet", tone: "#FEE2E2", accent: "#DC2626" },
  { id: "won", label: "Validé", tone: "#DCFCE7", accent: "#16A34A" },
  { id: "lost", label: "Perdu", tone: "#F1F5F9", accent: "#64748B" },
] as const;

export type StageId = (typeof STAGES)[number]["id"];

export interface DealRow {
  id: string;
  contact_id: string | null;
  assigned_to: string | null;
  insurance_type: string;
  stage: StageId;
  lead_score: number | null;
  estimated_commission: number | null;
  source_type: string | null;
  source_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  contacts?: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    source: string | null;
    tags: string[] | null;
  } | null;
}
