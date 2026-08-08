import { supabase } from '@/integrations/supabase/client';
import type { DocumentRow, DocumentInsert, DocumentsManquantsRow } from '@/types/ged';

// `documents` figure dans src/integrations/supabase/types.ts mais sans les
// colonnes ajoutées (contract_id, document_type, valid_until, is_required,
// superseded_by) : même confinement du any que crmFrom / portfolioFrom
// (cf. src/lib/crmApi.ts, src/lib/portfolioApi.ts) pour manipuler ces colonnes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const documentsFrom = (): any => supabase.from('documents' as any);

// Vue documents_manquants (lecture seule), absente du schéma généré.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const documentsManquantsFrom = (): any => supabase.from('documents_manquants' as any);

// Même bucket de stockage que GedPage.tsx / DealDrawer.tsx.
const STORAGE_BUCKET = 'crm-documents';

export async function fetchDocumentsForContract(contractId: string): Promise<DocumentRow[]> {
  const { data, error } = await documentsFrom()
    .select('*')
    .eq('contract_id', contractId)
    .order('document_type', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as DocumentRow[];
}

export async function createDocument(payload: DocumentInsert): Promise<DocumentRow> {
  const { data, error } = await documentsFrom().insert(payload).select('*').single();
  if (error) throw error;
  return data as DocumentRow;
}

export async function updateDocument(id: string, patch: Partial<DocumentInsert>): Promise<DocumentRow> {
  const { data, error } = await documentsFrom().update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as DocumentRow;
}

export async function deleteDocument(doc: Pick<DocumentRow, 'id' | 'file_path'>): Promise<void> {
  if (doc.file_path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([doc.file_path]);
  }
  const { error } = await documentsFrom().delete().eq('id', doc.id);
  if (error) throw error;
}

interface UploadContractDocumentMeta {
  document_type: DocumentInsert['document_type'];
  valid_until?: string | null;
  is_required?: boolean;
  deal_id?: string | null;
}

// Upload du fichier dans le bucket crm-documents puis création de la ligne
// `documents` associée. Si l'insertion échoue, le fichier déjà uploadé est
// retiré pour ne pas laisser d'objet orphelin dans le bucket.
export async function uploadContractDocument(
  contractId: string,
  file: File,
  meta: UploadContractDocumentMeta
): Promise<DocumentRow> {
  const path = `contracts/${contractId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file);
  if (uploadError) throw uploadError;

  try {
    return await createDocument({
      contract_id: contractId,
      deal_id: meta.deal_id ?? null,
      name: file.name,
      document_type: meta.document_type,
      status: 'valide',
      file_path: path,
      valid_until: meta.valid_until ?? null,
      is_required: meta.is_required ?? false,
    });
  } catch (e) {
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    throw e;
  }
}

export async function getSignedDocumentUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(filePath, 300);
  if (error) throw error;
  return data.signedUrl;
}

// ---------------------------------------------------------------------------
// Vue documents_manquants (lecture seule)
// ---------------------------------------------------------------------------

export async function fetchDocumentsManquants(): Promise<DocumentsManquantsRow[]> {
  const { data, error } = await documentsManquantsFrom().select('*');
  if (error) throw error;
  return (data ?? []) as DocumentsManquantsRow[];
}

export async function fetchDocumentsManquantsForContract(contractId: string): Promise<DocumentsManquantsRow[]> {
  const { data, error } = await documentsManquantsFrom().select('*').eq('contract_id', contractId);
  if (error) throw error;
  return (data ?? []) as DocumentsManquantsRow[];
}
