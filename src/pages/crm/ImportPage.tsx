import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { STAGES, type StageId } from "./types";

/* ---------------- CSV parser (handles quotes, commas, newlines) --------------- */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  const chars = text.replace(/\r\n?/g, "\n");
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (inQuotes) {
      if (c === '"' && chars[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === "," || c === ";" || c === "\t") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim().length));
}

/* ---------------- Domain validation --------------- */
const INSURANCE_MAP: Record<string, string> = {
  auto: "auto", moto: "moto", habitation: "habitation", sante: "sante",
  mutuelle: "sante", pret: "pret", emprunteur: "pret", animaux: "animaux",
  vie: "vie", prevoyance: "prevoyance", rc_pro: "rc_pro", "rc-pro": "rc_pro",
  rcpro: "rc_pro", mrp: "mrp", gli: "gli", pno: "pno",
  gestion_locative: "gestion_locative", metiers_atypiques: "metiers_atypiques",
};
function normalizeInsurance(v: string): string | null {
  const k = v.trim().toLowerCase().replace(/\s+/g, "_");
  return INSURANCE_MAP[k] ?? null;
}
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const STAGE_IDS = new Set(STAGES.map((s) => s.id));

interface ParsedRow {
  line: number;
  full_name: string;
  email: string;
  phone: string;
  insurance_type: string;
  stage: StageId;
  lead_score: number | null;
  notes: string | null;
  source: string;
  errors: string[];
}

const HEADER_ALIASES: Record<string, keyof Omit<ParsedRow, "line" | "errors">> = {
  nom: "full_name", "nom_complet": "full_name", "full_name": "full_name", name: "full_name",
  email: "email", mail: "email", "e-mail": "email",
  telephone: "phone", "téléphone": "phone", tel: "phone", phone: "phone", mobile: "phone",
  type: "insurance_type", "type_assurance": "insurance_type", "insurance_type": "insurance_type", produit: "insurance_type",
  etape: "stage", "étape": "stage", stage: "stage", statut: "stage",
  score: "lead_score", "lead_score": "lead_score",
  notes: "notes", note: "notes", commentaire: "notes",
  source: "source", origine: "source",
};

function normalizeHeader(h: string): keyof Omit<ParsedRow, "line" | "errors"> | null {
  const k = h.trim().toLowerCase().replace(/[^a-z_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return HEADER_ALIASES[k] ?? null;
}

function validateRows(rows: string[][]): { headers: string[]; parsed: ParsedRow[] } {
  const [headerRow, ...body] = rows;
  const map = headerRow.map(normalizeHeader);
  const required = ["full_name", "email", "phone", "insurance_type"];
  const missing = required.filter((r) => !map.includes(r as any));
  if (missing.length) {
    throw new Error(`Colonnes manquantes : ${missing.join(", ")}`);
  }
  const parsed: ParsedRow[] = body.map((cols, idx) => {
    const rec: any = {};
    map.forEach((key, i) => { if (key) rec[key] = (cols[i] ?? "").trim(); });
    const errors: string[] = [];
    const full_name = rec.full_name ?? "";
    const email = (rec.email ?? "").toLowerCase();
    const phone = rec.phone ?? "";
    const insurance = normalizeInsurance(rec.insurance_type ?? "");
    let stage: StageId = "lead";
    if (rec.stage) {
      if (STAGE_IDS.has(rec.stage)) stage = rec.stage as StageId;
      else errors.push(`étape "${rec.stage}" inconnue`);
    }
    const scoreRaw = rec.lead_score;
    let lead_score: number | null = null;
    if (scoreRaw) {
      const n = Number(scoreRaw);
      if (Number.isFinite(n) && n >= 0 && n <= 100) lead_score = Math.round(n);
      else errors.push("score invalide (0-100)");
    }
    if (full_name.length < 2 || full_name.length > 120) errors.push("nom invalide");
    if (!EMAIL_RE.test(email)) errors.push("email invalide");
    if (phone.length < 6 || phone.length > 30) errors.push("téléphone invalide");
    if (!insurance) errors.push(`type "${rec.insurance_type}" inconnu`);

    return {
      line: idx + 2,
      full_name,
      email,
      phone,
      insurance_type: insurance ?? rec.insurance_type ?? "",
      stage,
      lead_score,
      notes: rec.notes || null,
      source: rec.source || "import_csv",
      errors,
    };
  });
  return { headers: headerRow, parsed };
}

/* ---------------- Component --------------- */
const SAMPLE = `full_name,email,phone,insurance_type,stage,lead_score,notes,source
Jean Dupont,jean.dupont@example.fr,0612345678,auto,lead,70,Devis demandé,salon_pro
Marie Martin,marie.martin@example.fr,0698765432,sante,qualified,85,Rappeler mardi,partenariat`;

export default function ImportPage() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ ok: number; failed: number } | null>(null);

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setFileName(f.name);
    setResult(null);
    setParseError(null);
    try {
      const text = await f.text();
      const raw = parseCSV(text);
      if (raw.length < 2) throw new Error("Fichier vide ou sans données");
      const { parsed } = validateRows(raw);
      setRows(parsed);
    } catch (err: any) {
      setRows([]);
      setParseError(err.message || "Fichier invalide");
    }
  };

  const runImport = async () => {
    if (!validRows.length) return;
    setImporting(true);
    let ok = 0;
    let failed = 0;
    for (const r of validRows) {
      try {
        // Upsert contact by email
        const { data: contact, error: cErr } = await supabase
          .from("contacts")
          .upsert(
            {
              email: r.email,
              full_name: r.full_name,
              phone: r.phone,
              source: r.source,
              rgpd_consent: true,
              rgpd_consent_at: new Date().toISOString(),
            },
            { onConflict: "email" }
          )
          .select("id")
          .single();
        if (cErr || !contact) throw cErr ?? new Error("contact");

        const { error: dErr } = await supabase.from("deals").insert({
          contact_id: contact.id,
          insurance_type: r.insurance_type,
          stage: r.stage,
          lead_score: r.lead_score,
          notes: r.notes,
          source_type: "import_csv",
        });
        if (dErr) throw dErr;
        ok++;
      } catch (err) {
        console.error("Import row failed", r.line, err);
        failed++;
      }
    }
    setImporting(false);
    setResult({ ok, failed });
    toast.success(`${ok} deals importés${failed ? `, ${failed} échecs` : ""}`);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "modele-import-deals.csv";
    a.click();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Import de deals
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Importez des prospects depuis un fichier CSV. Les contacts existants (email) sont réutilisés.
        </p>
      </header>

      <section className="mb-6 grid gap-4 rounded-3xl border border-[#E9D5FF] bg-white p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">1. Préparer votre fichier</h2>
          <p className="mt-1 text-xs text-slate-500">
            Colonnes requises : <code className="rounded bg-slate-100 px-1">full_name</code>,{" "}
            <code className="rounded bg-slate-100 px-1">email</code>,{" "}
            <code className="rounded bg-slate-100 px-1">phone</code>,{" "}
            <code className="rounded bg-slate-100 px-1">insurance_type</code>.
            Optionnelles : <code className="rounded bg-slate-100 px-1">stage</code>,{" "}
            <code className="rounded bg-slate-100 px-1">lead_score</code>,{" "}
            <code className="rounded bg-slate-100 px-1">notes</code>,{" "}
            <code className="rounded bg-slate-100 px-1">source</code>.
          </p>
        </div>
        <Button variant="outline" onClick={downloadSample} className="rounded-full border-[#E9D5FF]">
          <Download className="mr-1.5 h-4 w-4" />
          Modèle CSV
        </Button>
      </section>

      <section className="mb-6 rounded-3xl border border-[#E9D5FF] bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-800">2. Sélectionner un fichier</h2>
        <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#E9D5FF] bg-[#FAF5FF] px-6 py-8 text-sm text-slate-600 hover:bg-[#F3E8FF]">
          <Upload className="h-5 w-5 text-[#7C3AED]" />
          <span>
            {fileName ? (
              <><strong className="text-slate-800">{fileName}</strong> — cliquez pour changer</>
            ) : (
              "Cliquez pour choisir un fichier CSV (max 5 Mo)"
            )}
          </span>
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
        </label>
        {parseError && (
          <p className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" /> {parseError}
          </p>
        )}
      </section>

      {rows.length > 0 && (
        <section className="rounded-3xl border border-[#E9D5FF] bg-white p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">3. Aperçu et validation</h2>
              <p className="mt-1 text-xs text-slate-500">
                <span className="font-medium text-green-700">{validRows.length}</span> valides ·{" "}
                <span className="font-medium text-red-600">{invalidRows.length}</span> à corriger
              </p>
            </div>
            <Button
              onClick={runImport}
              disabled={!validRows.length || importing}
              className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]"
            >
              <FileSpreadsheet className="mr-1.5 h-4 w-4" />
              {importing ? "Import en cours…" : `Importer ${validRows.length} deals`}
            </Button>
          </div>

          {result && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F0FDF4] px-4 py-3 text-sm text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              {result.ok} deals créés{result.failed ? ` — ${result.failed} en échec` : ""}
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="px-2 py-2">Ligne</th>
                  <th className="px-2 py-2">Nom</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Tél.</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Étape</th>
                  <th className="px-2 py-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, 200).map((r) => (
                  <tr key={r.line} className={r.errors.length ? "bg-red-50/50" : ""}>
                    <td className="px-2 py-2 text-slate-400">{r.line}</td>
                    <td className="px-2 py-2">{r.full_name}</td>
                    <td className="px-2 py-2">{r.email}</td>
                    <td className="px-2 py-2">{r.phone}</td>
                    <td className="px-2 py-2">{r.insurance_type}</td>
                    <td className="px-2 py-2">{r.stage}</td>
                    <td className="px-2 py-2">
                      {r.errors.length ? (
                        <span className="text-red-600">{r.errors.join(", ")}</span>
                      ) : (
                        <span className="text-green-700">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 200 && (
              <p className="mt-2 text-[11px] text-slate-400">
                Affichage limité aux 200 premières lignes ({rows.length} au total).
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
