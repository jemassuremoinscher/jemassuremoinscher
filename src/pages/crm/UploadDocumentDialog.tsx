import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { uploadContractDocument } from "@/lib/gedApi";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, type DocumentType } from "@/types/ged";

export function UploadDocumentDialog({
  contractId,
  dealId,
  onUploaded,
}: {
  contractId: string;
  dealId?: string | null;
  onUploaded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("autre");
  const [validUntil, setValidUntil] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setFile(null);
    setDocumentType("autre");
    setValidUntil("");
    setIsRequired(false);
  };

  const submit = async () => {
    if (!file) {
      toast.error("Choisis un fichier");
      return;
    }
    setSaving(true);
    try {
      await uploadContractDocument(contractId, file, {
        document_type: documentType,
        valid_until: validUntil || null,
        is_required: isRequired,
        deal_id: dealId ?? null,
      });
      toast.success("Document ajouté");
      reset();
      setOpen(false);
      onUploaded();
    } catch (e) {
      toast.error("Erreur lors de l'upload");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]">
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          Ajouter un document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Type de document</Label>
            <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {DOCUMENT_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="doc-file">Fichier</Label>
            <Input
              id="doc-file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="doc-valid-until">Valide jusqu'au (facultatif)</Label>
            <Input
              id="doc-valid-until"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="doc-required"
              checked={isRequired}
              onCheckedChange={(c) => setIsRequired(!!c)}
            />
            <Label htmlFor="doc-required" className="text-sm font-normal">
              Document obligatoire pour ce contrat
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
            {saving ? "Envoi…" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
