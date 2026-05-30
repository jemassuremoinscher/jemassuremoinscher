import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  type: string;
  details: Record<string, any>;
  estimatedPrice: number;
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

    const { name, email, phone, type, details, estimatedPrice }: QuoteRequest = requestData;

    console.log("Sending quote email for:", { type, timestamp: new Date().toISOString() });

    // Use the verified email for both from and to (Resend requirement in test mode)
    const businessEmail = "contact@jemassuremoinscher.fr";

    // Initialize Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Find the quote_id if it exists (look for recent quote from this email)
    const { data: recentQuote } = await supabaseClient
      .from('insurance_quotes')
      .select('id')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

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
        quote_id: recentQuote?.id || null,
        recipient_email: businessEmail,
        recipient_name: 'Admin',
        email_type: 'quote_notification',
        subject: `Nouvelle demande de devis - ${type}`,
        resend_email_id: ownerEmail.data.id,
        status: 'sent',
      });
    }

    // Email au client - Note: In Resend test mode, emails can only be sent to verified addresses
    // The client's info is already sent to the business email above
    // To enable client emails, verify your domain at resend.com/domains
    let clientEmail: any = { data: null, error: null };
    
    // Only attempt to send if the client email is the verified business email (for testing)
    if (email === businessEmail) {
      clientEmail = await resend.emails.send({
        from: `jemassuremoinscher.fr <${businessEmail}>`,
        to: email,
        subject: "Votre devis d'assurance",
        html: `
          <h1>Merci pour votre demande, ${name} !</h1>
          <p>Nous avons bien reçu votre demande de devis pour une <strong>${type}</strong>.</p>
          
          <h2>Votre tarif estimé</h2>
          <p style="font-size: 32px; color: #7e22ce; font-weight: bold;">${estimatedPrice}€/mois</p>
          
          <p>Un de nos conseillers vous contactera dans les plus brefs délais au <strong>${phone}</strong> pour finaliser votre devis.</p>
          
          <p>Cordialement,<br>L'équipe jemassuremoinscher.fr</p>
        `,
      });
    } else {
      console.log(`Skipping client email to ${email} - only verified addresses can receive emails in test mode`);
    }

    // Track client email
    if (clientEmail.data) {
      await supabaseClient.from('email_tracking').insert({
        quote_id: recentQuote?.id || null,
        recipient_email: email,
        recipient_name: name,
        email_type: 'quote_confirmation',
        subject: "Votre devis d'assurance",
        resend_email_id: clientEmail.data.id,
        status: 'sent',
      });
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
