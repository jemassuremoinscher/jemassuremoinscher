import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const TABLES = [
  'contacts',
  'deals',
  'deal_tasks',
  'documents',
  'activities',
  'contracts',
  'claims',
  'commission_payments',
  'insurance_quotes',
  'contact_callbacks',
  'quiz_leads',
  'newsletter_subscribers',
  'chatbot_transfers',
  'sales_agents',
  'profiles',
  'user_roles',
  'seo_article_suggestions',
  'published_drafts',
  'advice_records',
  'deal_audit_log',
]

const RETENTION_DAYS = 30

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // --- Auth : CRON_SECRET (cron) ou utilisateur admin connecté ---
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()

  const { data: cfg } = await supabase
    .from('cron_config')
    .select('value')
    .eq('key', 'CRON_SECRET')
    .maybeSingle()
  const cronSecret = cfg?.value ?? ''

  let triggerSource = 'cron'
  let authorized = !!cronSecret && token === cronSecret

  if (!authorized && token) {
    const { data: userData } = await supabase.auth.getUser(token)
    if (userData?.user) {
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: userData.user.id,
        _role: 'admin',
      })
      if (isAdmin) {
        authorized = true
        triggerSource = 'manuel'
      }
    }
  }

  if (!authorized) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { data: snapshot, error: snapErr } = await supabase
    .from('backup_snapshots')
    .insert({ trigger_source: triggerSource, status: 'running' })
    .select('id')
    .single()

  if (snapErr || !snapshot) {
    return new Response(JSON.stringify({ error: snapErr?.message ?? 'insert failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const dump: Record<string, unknown[]> = {}
    const counts: Record<string, number> = {}
    let total = 0

    for (const table of TABLES) {
      const rows: unknown[] = []
      let from = 0
      const page = 1000
      // pagination pour ne rien tronquer
      while (true) {
        const { data, error } = await supabase.from(table).select('*').range(from, from + page - 1)
        if (error) throw new Error(`${table}: ${error.message}`)
        rows.push(...(data ?? []))
        if (!data || data.length < page) break
        from += page
      }
      dump[table] = rows
      counts[table] = rows.length
      total += rows.length
    }

    const now = new Date()
    const filePath = `${now.toISOString().slice(0, 10)}/backup-${now.toISOString().replace(/[:.]/g, '-')}.json`
    const body = JSON.stringify({ generated_at: now.toISOString(), tables: dump })
    const bytes = new TextEncoder().encode(body)

    const { error: upErr } = await supabase.storage
      .from('db-backups')
      .upload(filePath, bytes, { contentType: 'application/json', upsert: true })
    if (upErr) throw new Error(`upload: ${upErr.message}`)

    await supabase
      .from('backup_snapshots')
      .update({
        status: 'success',
        tables: counts,
        row_count: total,
        file_path: filePath,
        size_bytes: bytes.byteLength,
        completed_at: new Date().toISOString(),
      })
      .eq('id', snapshot.id)

    // Purge des sauvegardes de plus de 30 jours
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString()
    const { data: old } = await supabase
      .from('backup_snapshots')
      .select('id, file_path')
      .lt('created_at', cutoff)
    if (old?.length) {
      const paths = old.map((o) => o.file_path).filter(Boolean) as string[]
      if (paths.length) await supabase.storage.from('db-backups').remove(paths)
      await supabase.from('backup_snapshots').delete().in('id', old.map((o) => o.id))
    }

    return new Response(
      JSON.stringify({ ok: true, id: snapshot.id, rows: total, file_path: filePath }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    await supabase
      .from('backup_snapshots')
      .update({ status: 'error', error_message: message, completed_at: new Date().toISOString() })
      .eq('id', snapshot.id)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
