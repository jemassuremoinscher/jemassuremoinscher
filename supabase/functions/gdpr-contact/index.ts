import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Demandes RGPD par email, réservées aux administrateurs connectés.
// PHASE 1 : export JSON et SIMULATION d'effacement. Cette fonction ne
// modifie et ne supprime AUCUNE donnée personnelle : sa seule écriture est
// une ligne dans gdpr_requests (empreinte de l'email, nombres de lignes).
//
// POST { "email": "...", "action": "export" | "simulate" }
//
// - Recherche, sans tenir compte des majuscules, dans les tables qui
//   contiennent un email, puis dans les tables rattachées aux contacts,
//   devis, rappels et deals retrouvés (liste ci-dessous).
// - export : toutes les lignes trouvées, table par table, et la liste des
//   fichiers stockés (bucket crm-documents).
// - simulate : nombre de lignes par table et action prévue pour la phase 2
//   (supprimer / anonymiser). Si un deal est validé ou en souscription, ou
//   s'il existe un contrat ou une fiche de devoir de conseil : "traitement
//   manuel", rien ne serait effacé automatiquement.
// - Chaque appel est tracé dans gdpr_requests AVANT la réponse : si la trace
//   échoue, rien n'est renvoyé.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const DOCUMENTS_BUCKET = "crm-documents";
// Au-delà, la réponse signale une recherche tronquée (jamais attendu pour
// une seule personne).
const ROW_LIMIT = 5000;
// Étapes à partir desquelles le prospect est client : traitement manuel.
const CLIENT_STAGES = ["won", "subscription"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

// deno-lint-ignore no-explicit-any
type Admin = SupabaseClient<any, any, any, any, any>;
type Row = Record<string, unknown> & { id: string };
type PlannedAction = "supprimer" | "anonymiser" | "conserver (traitement manuel)";

// Action prévue en phase 2, table par table (plan RGPD validé).
const PLANNED: Record<string, PlannedAction> = {
  contacts: "supprimer",
  insurance_quotes: "supprimer",
  contact_callbacks: "supprimer",
  chatbot_transfers: "supprimer",
  quiz_leads: "supprimer",
  newsletter_subscribers: "supprimer",
  blog_comments: "supprimer",
  deals: "supprimer",
  documents: "supprimer",
  quote_followup_log: "supprimer",
  deal_stage_email_log: "supprimer",
  lead_alert_log: "supprimer",
  activities: "anonymiser",
  deal_audit_log: "anonymiser",
  email_tracking: "anonymiser",
  contracts: "conserver (traitement manuel)",
  advice_records: "conserver (traitement manuel)",
};

const normalizeEmail = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
};

// Égalité insensible à la casse via ILIKE : on neutralise les jokers.
const ilikeExact = (email: string) => email.replace(/[\\%_]/g, (c) => `\\${c}`);

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

class Collector {
  tables: Record<string, Map<string, Row>> = {};
  truncated: string[] = [];

  add(table: string, rows: Row[] | null) {
    const map = (this.tables[table] ??= new Map());
    for (const r of rows ?? []) map.set(r.id, r);
  }

  ids(table: string): string[] {
    return [...(this.tables[table]?.keys() ?? [])];
  }

  rows(table: string): Row[] {
    return [...(this.tables[table]?.values() ?? [])];
  }
}

async function fetchByEmail(admin: Admin, c: Collector, table: string, column: string, email: string) {
  const { data, error } = await admin.from(table).select("*").ilike(column, ilikeExact(email)).limit(ROW_LIMIT);
  if (error) throw new Error(`${table}: ${error.message}`);
  if ((data?.length ?? 0) >= ROW_LIMIT) c.truncated.push(table);
  c.add(table, data as Row[]);
}

async function fetchByIds(admin: Admin, c: Collector, table: string, column: string, ids: string[]) {
  if (ids.length === 0) {
    c.add(table, []);
    return;
  }
  const { data, error } = await admin.from(table).select("*").in(column, ids).limit(ROW_LIMIT);
  if (error) throw new Error(`${table}.${column}: ${error.message}`);
  if ((data?.length ?? 0) >= ROW_LIMIT) c.truncated.push(table);
  c.add(table, data as Row[]);
}

async function collect(admin: Admin, email: string): Promise<Collector> {
  const c = new Collector();

  // 1) Tables qui portent l'email.
  await Promise.all([
    fetchByEmail(admin, c, "contacts", "email", email),
    fetchByEmail(admin, c, "insurance_quotes", "email", email),
    fetchByEmail(admin, c, "contact_callbacks", "email", email),
    fetchByEmail(admin, c, "chatbot_transfers", "visitor_email", email),
    fetchByEmail(admin, c, "quiz_leads", "email", email),
    fetchByEmail(admin, c, "newsletter_subscribers", "email", email),
    fetchByEmail(admin, c, "email_tracking", "recipient_email", email),
    fetchByEmail(admin, c, "blog_comments", "author_email", email),
  ]);

  const contactIds = c.ids("contacts");
  const sourceIds = [...c.ids("insurance_quotes"), ...c.ids("contact_callbacks")];

  // 2) Deals du contact ou issus de ses devis / rappels ; suivi d'emails des devis.
  await Promise.all([
    fetchByIds(admin, c, "deals", "contact_id", contactIds),
    fetchByIds(admin, c, "deals", "source_id", sourceIds),
    fetchByIds(admin, c, "email_tracking", "quote_id", c.ids("insurance_quotes")),
  ]);
  const dealIds = c.ids("deals");

  // 3) Contrats et fiches de conseil (par contact ou par deal).
  await Promise.all([
    fetchByIds(admin, c, "contracts", "contact_id", contactIds),
    fetchByIds(admin, c, "contracts", "deal_id", dealIds),
    fetchByIds(admin, c, "advice_records", "contact_id", contactIds),
    fetchByIds(admin, c, "advice_records", "deal_id", dealIds),
  ]);

  // 4) Tout ce qui est rattaché aux deals (et documents des contrats).
  await Promise.all([
    fetchByIds(admin, c, "activities", "deal_id", dealIds),
    fetchByIds(admin, c, "deal_audit_log", "deal_id", dealIds),
    fetchByIds(admin, c, "documents", "deal_id", dealIds),
    fetchByIds(admin, c, "documents", "contract_id", c.ids("contracts")),
    fetchByIds(admin, c, "quote_followup_log", "deal_id", dealIds),
    fetchByIds(admin, c, "deal_stage_email_log", "deal_id", dealIds),
    fetchByIds(admin, c, "lead_alert_log", "deal_id", dealIds),
  ]);

  return c;
}

function manualReasons(c: Collector): string[] {
  const reasons: string[] = [];
  const clientDeals = c.rows("deals").filter((d) => CLIENT_STAGES.includes(String(d.stage)));
  if (clientDeals.length > 0) reasons.push(`${clientDeals.length} deal(s) validé(s) ou en souscription`);
  if (c.ids("contracts").length > 0) reasons.push(`${c.ids("contracts").length} contrat(s)`);
  if (c.ids("advice_records").length > 0) reasons.push(`${c.ids("advice_records").length} fiche(s) de devoir de conseil`);
  return reasons;
}

const storageFiles = (c: Collector) =>
  c
    .rows("documents")
    .map((d) => d.file_path)
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .map((path) => ({ bucket: DOCUMENTS_BUCKET, path }));

// Empreinte des lignes trouvées (table -> ids triés) : en phase 2, la
// confirmation devra la reprendre pour n'effacer que ce qui a été simulé.
function fingerprint(c: Collector): Promise<string> {
  const canonical = Object.keys(c.tables)
    .sort()
    .map((t) => [t, c.ids(t).sort()]);
  return sha256Hex(JSON.stringify(canonical));
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  // Authentification : utilisateur connecté avec le rôle admin.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Non autorisé" }, 401);
  const asUser = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
  const { data: userData, error: userErr } = await asUser.auth.getUser();
  const user = userData?.user;
  if (userErr || !user) return json({ error: "Non autorisé" }, 401);
  const { data: role, error: roleErr } = await asUser
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (roleErr || !role) return json({ error: "Réservé aux administrateurs" }, 403);

  const body = await req.json().catch(() => ({}));
  const action = body?.action;
  if (action !== "export" && action !== "simulate") {
    return json({ error: "action doit valoir \"export\" ou \"simulate\"" }, 400);
  }
  const email = normalizeEmail(body?.email);
  if (!email) return json({ error: "Email invalide" }, 400);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  let c: Collector;
  try {
    c = await collect(admin, email);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("gdpr-contact: recherche échouée:", message);
    return json({ error: `Recherche échouée : ${message}` }, 500);
  }

  const counts: Record<string, number> = {};
  for (const t of Object.keys(c.tables)) counts[t] = c.ids(t).length;
  const files = storageFiles(c);
  counts.storage_files = files.length;
  const found = Object.values(counts).some((n) => n > 0);
  const reasons = manualReasons(c);
  const outcome = !found ? "not_found" : reasons.length > 0 ? "manual_review" : "found";
  const emailHash = await sha256Hex(email);
  const fp = await fingerprint(c);

  const { error: logErr } = await admin.from("gdpr_requests").insert({
    requested_by: user.id,
    email_hash: emailHash,
    action,
    outcome,
    counts,
    manual_reasons: reasons,
    fingerprint: fp,
  });
  if (logErr) {
    console.error("gdpr-contact: échec de la trace gdpr_requests:", logErr.message);
    return json({ error: "Trace de la demande impossible : rien n'a été renvoyé." }, 500);
  }

  if (action === "export") {
    const tables: Record<string, Row[]> = {};
    for (const t of Object.keys(c.tables).sort()) tables[t] = c.rows(t);
    return json({
      generated_at: new Date().toISOString(),
      email,
      found,
      truncated: c.truncated,
      tables,
      storage_files: files,
    });
  }

  const plan = Object.keys(c.tables)
    .sort()
    .map((t) => ({
      table: t,
      count: counts[t],
      planned_action: reasons.length > 0 ? ("conserver (traitement manuel)" as PlannedAction) : PLANNED[t],
    }))
    .filter((p) => p.count > 0);

  return json({
    simulation: true,
    note: "Simulation : aucune donnée n'a été modifiée ni supprimée.",
    found,
    manual_review: reasons.length > 0,
    manual_reasons: reasons,
    truncated: c.truncated,
    fingerprint: fp,
    tables: plan,
    storage_files: { count: files.length, planned_action: reasons.length > 0 ? "conserver (traitement manuel)" : "supprimer" },
  });
});
