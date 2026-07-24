import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Tag, Pencil } from "lucide-react";
import { EditContactDialog } from "./EditContactDialog";

type Ctx = { query: string };

type Contact = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  source: string | null;
  tags: string[] | null;
  created_at: string;
  deal_count?: number;
};

export default function ContactsPage() {
  const { query } = useOutletContext<Ctx>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [source, setSource] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Contact | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("contacts")
      .select("id,email,full_name,phone,source,tags,created_at,deals(id)")
      .order("created_at", { ascending: false })
      .limit(1000);
    const rows = (data ?? []).map((c: any) => ({ ...c, deal_count: c.deals?.length ?? 0 }));
    setContacts(rows);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sources = useMemo(
    () =>
      Array.from(new Set(contacts.map((c) => c.source ?? "inconnu"))).sort(),
    [contacts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (source !== "all" && (c.source ?? "inconnu") !== source) return false;
      if (!q) return true;
      return (
        c.email?.toLowerCase().includes(q) ||
        c.full_name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
      );
    });
  }, [contacts, query, source]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Contacts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Chargement…" : `${filtered.length} contacts`}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="h-9 rounded-full border border-[#E9D5FF] bg-white px-3 text-sm"
          >
            <option value="all">Toutes sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#E9D5FF] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5FF] text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Deals</th>
              <th className="px-4 py-3">Créé</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAF5FF]/60">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {c.full_name || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center gap-1.5 text-[#7C3AED] hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {c.email}
                    </a>
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="flex items-center gap-1.5 text-slate-600"
                      >
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="rounded-full">
                    {c.source ?? "—"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(c.tags ?? []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-[#F5F3FF] px-2 py-0.5 text-xs text-[#6D28D9]"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">
                  {c.deal_count}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(c.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(c)} className="text-[#7C3AED]">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  Aucun contact
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditContactDialog
        contact={editing}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        onSaved={load}
      />
    </div>
  );
}
