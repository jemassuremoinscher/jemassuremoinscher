import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-captcha-token",
};

interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  type: string;
  details: Record<string, any>;
  estimatedPrice: number;
  /**
   * Optionnel : seuls MultiStepQuoteForm.tsx et QuoteRequestForm.tsx le
   * transmettent (id généré côté client, utilisé comme insurance_quotes.id).
   * Les autres appelants de invokeSendQuoteEmail (QuickHelpSection,
   * TransferDialog, CallbackForm, InsuranceQuiz, CommentsSection,
   * QuickQuoteSection, SimplifiedLeadForm, SubscriptionModal) n'insèrent pas
   * dans insurance_quotes avec un id capturé, ou pas du tout — leadId reste
   * undefined pour eux, la résolution de deal_id est alors sautée sans
   * casser l'envoi d'email (comportement identique à avant ce changement).
   */
  leadId?: string;
}

// Rate limiting: track requests by IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function validateQuoteRequest(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  } else if (data.email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    errors.push('Phone is required');
  } else if (data.phone.length > 20) {
    errors.push('Phone must be less than 20 characters');
  }

  if (!data.type || typeof data.type !== 'string' || data.type.trim().length === 0) {
    errors.push('Insurance type is required');
  }

  if (typeof data.estimatedPrice !== 'number' || data.estimatedPrice < 0) {
    errors.push('Estimated price must be a positive number');
  }

  return { valid: errors.length === 0, errors };
}

async function verifyCaptcha(token: string, ip: string): Promise<boolean> {
  const secret = Deno.env.get("RECAPTCHA_SECRET_KEY");
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY not configured — rejecting request");
    return false;
  }
  try {
    const params = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") params.append("remoteip", ip);
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json();
    // v3 returns score 0..1 — accept 0.3+ to keep false-positive rate low
    return Boolean(data?.success) && (typeof data?.score !== "number" || data.score >= 0.3);
  } catch (e) {
    console.error("reCAPTCHA verification failed:", e);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Verify reCAPTCHA v3 token (required for all public callers)
    const captchaToken = req.headers.get("x-captcha-token") || "";
    if (!captchaToken) {
      return new Response(
        JSON.stringify({ error: "Missing captcha token" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    const captchaOk = await verifyCaptcha(captchaToken, clientIP);
    if (!captchaOk) {
      console.warn(`reCAPTCHA rejected for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Captcha verification failed" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }


    const requestData = await req.json();
    
    // Validate input data
    const validation = validateQuoteRequest(requestData);
    if (!validation.valid) {
      console.warn("Invalid quote request:", validation.errors);
      return new Response(
        JSON.stringify({ error: "Invalid request data", details: validation.errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, type, details, estimatedPrice, leadId }: QuoteRequest = requestData;

    console.log("Sending quote email for:", { type, timestamp: new Date().toISOString() });

    // Use the verified email for both from and to (Resend requirement in test mode)
    const businessEmail = "contact@jemassuremoinscher.fr";

    // Initialize Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // quote_id = leadId directement : c'est l'id que le frontend a lui-même
    // attribué à la ligne insurance_quotes qu'il vient d'insérer (voir
    // MultiStepQuoteForm.tsx). Remplace l'ancienne recherche "le devis le
    // plus récent pour cet email", fragile si la même adresse soumet deux
    // formulaires rapidement (mauvais quote_id silencieusement associé).
    // deal_id résolu via deals.source_id (bridge_quote_to_deal, migration
    // 20260724032007) : ce trigger crée le deal dans la même transaction
    // que l'insert insurance_quotes, donc il existe déjà à ce stade.
    // Si leadId absent (appelants qui n'insèrent pas dans insurance_quotes
    // avec un id capturé, cf. interface QuoteRequest), les deux restent null
    // — pas de régression sur ces chemins, juste pas de rattachement.
    let quoteId: string | null = null;
    let dealId: string | null = null;
    if (leadId) {
      quoteId = leadId;
      const { data: deal } = await supabaseClient
        .from('deals')
        .select('id')
        .eq('source_type', 'insurance_quote')
        .eq('source_id', leadId)
        .maybeSingle();
      dealId = deal?.id ?? null;
    }

    // Email au propriétaire du site
    const ownerEmail = await resend.emails.send({
      from: `jemassuremoinscher.fr <${businessEmail}>`,
      to: businessEmail,
      subject: `Nouvelle demande de devis - ${type}`,
      html: (() => {
        const esc = (s: unknown) => String(s ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        return `
        <h1>Nouvelle demande de devis</h1>
        <h2>Type d'assurance: ${esc(type)}</h2>
        
        <h3>Coordonnées du client:</h3>
        <ul>
          <li><strong>Nom:</strong> ${esc(name)}</li>
          <li><strong>Email:</strong> ${esc(email)}</li>
          <li><strong>Téléphone:</strong> ${esc(phone)}</li>
        </ul>
        
        <h3>Détails de la demande:</h3>
        <pre>${esc(JSON.stringify(details, null, 2))}</pre>
        
        <h3>Tarif estimé:</h3>
        <p style="font-size: 24px; color: #7e22ce; font-weight: bold;">${esc(estimatedPrice)}€/mois</p>
      `;
      })(),
    });

    // Track owner email
    if (ownerEmail.data) {
      await supabaseClient.from('email_tracking').insert({
        quote_id: quoteId,
        recipient_email: businessEmail,
        recipient_name: 'Admin',
        email_type: 'quote_notification',
        subject: `Nouvelle demande de devis - ${type}`,
        resend_email_id: ownerEmail.data.id,
        status: 'sent',
      });
    }

    // Email au client — domaine vérifié côté Resend depuis le 2026-09-09,
    // l'envoi n'est plus restreint aux adresses de test : on tente toujours.
    // Contenu basé sur le template "Confirmation de demande de contact"
    // (table email_templates) s'il existe et est actif ; sinon, contenu en
    // dur ci-dessous conservé comme filet de sécurité.
    const escHtml = (s: unknown) => String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    const fillVars = (text: string) => text
      .replace(/\{\{\s*prenom\s*\}\}/gi, name.trim().split(/\s+/)[0] || name)
      .replace(/\{\{\s*produit\s*\}\}/gi, type);
    // Logo uniquement sur l'email client (identité visuelle destinée au
    // lead) — jamais sur l'email de notification interne au propriétaire
    // du site (ownerEmail ci-dessus), qui reste un simple message technique.
    const EMAIL_LOGO_HEADER = `<div style="background-color:#ffffff;padding:24px 0;text-align:center;">
  <img
    src="https://www.jemassuremoinscher.fr/arthur-thumbs-up-email.png"
    alt="jemassuremoinscher.fr"
    width="140"
    height="151"
    style="display:block;margin:0 auto;width:140px;height:auto;max-width:140px;border:0;outline:none;text-decoration:none;"
  />
</div>`;
    const bodyToHtml = (body: string) =>
      `${EMAIL_LOGO_HEADER}<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#111827;">${escHtml(body).replace(/\r?\n/g, '<br>')}</div>`;

    const { data: template } = await supabaseClient
      .from('email_templates')
      .select('subject, body')
      .eq('name', 'Confirmation de demande de contact')
      .eq('is_active', true)
      .maybeSingle();

    const clientSubject = template ? fillVars(template.subject) : "Votre devis d'assurance";
    const clientHtml = template
      ? bodyToHtml(fillVars(template.body))
      : `
          ${EMAIL_LOGO_HEADER}
          <h1>Merci pour votre demande, ${escHtml(name)} !</h1>
          <p>Nous avons bien reçu votre demande de devis pour une <strong>${escHtml(type)}</strong>.</p>

          <h2>Votre tarif estimé</h2>
          <p style="font-size: 32px; color: #7e22ce; font-weight: bold;">${escHtml(estimatedPrice)}€/mois</p>

          <p>Un de nos conseillers vous contactera dans les plus brefs délais au <strong>${escHtml(phone)}</strong> pour finaliser votre devis.</p>

          <p>Cordialement,<br>L'équipe jemassuremoinscher.fr</p>
        `;

    let clientEmail: any = { data: null, error: null };
    try {
      clientEmail = await resend.emails.send({
        from: `jemassuremoinscher.fr <${businessEmail}>`,
        to: email,
        subject: clientSubject,
        html: clientHtml,
      });
      if (clientEmail.error) {
        console.error("Échec de l'envoi de l'email client:", clientEmail.error);
      }
    } catch (e) {
      console.error("Exception pendant l'envoi de l'email client:", e);
    }

    // Track client email
    if (clientEmail.data) {
      await supabaseClient.from('email_tracking').insert({
        quote_id: quoteId,
        recipient_email: email,
        recipient_name: name,
        email_type: 'quote_confirmation',
        subject: "Votre devis d'assurance",
        resend_email_id: clientEmail.data.id,
        status: 'sent',
      });

      // Trace dans le tiroir du deal (LeadTimeline.tsx lit activities.deal_id)
      // — trou de visibilité corrigé le 2026-09-16 : l'email partait déjà
      // mais n'apparaissait jamais côté CRM. Même pattern que
      // crm-send-template/crm-send-auto-template ; author_id absent
      // volontairement (LeadTimeline affiche "Système" quand null).
      // Sautée si dealId n'a pas pu être résolu (leadId absent, ou deal pas
      // encore créé par le trigger pour une raison quelconque).
      if (dealId) {
        const { error: activityErr } = await supabaseClient.from('activities').insert({
          deal_id: dealId,
          author_id: null,
          action_type: 'email',
          description: `Confirmation de demande de contact envoyée : ${clientSubject}`,
          metadata: { kind: 'quote_confirmation', resend_email_id: clientEmail.data.id },
        });
        if (activityErr) {
          console.error("Email envoyé mais échec du log activities:", activityErr);
        }
      }
    }

    console.log("Emails sent successfully:", { ownerEmail, clientEmail });

    return new Response(
      JSON.stringify({
        success: true,
        estimatedPrice,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
