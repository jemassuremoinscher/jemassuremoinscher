import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Rate limiting: track requests by IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;

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

// Hash a token using SHA-256 for secure storage
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length === 0) {
    return { valid: false, error: 'Email cannot be empty' };
  }
  
  if (trimmedEmail.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' };
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
}

interface ConfirmRequest {
  token: string;
}

interface UnsubscribeRequest {
  email: string;
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

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Trop de requêtes. Veuillez réessayer plus tard." 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Handle email confirmation (supports GET from email link or POST with body)
    if (action === "confirm") {
      let token: string;
      if (req.method === "GET") {
        token = url.searchParams.get("token") || "";
      } else {
        const body: ConfirmRequest = await req.json();
        token = body.token;
      }

      if (!token) {
        return new Response(
          JSON.stringify({ success: false, message: "Token manquant" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Hash the incoming token to compare against stored hash
      const hashedToken = await hashToken(token);

      const { data: subscriber, error } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "active",
          confirmed_at: new Date().toISOString(),
          confirmation_token: null, // Clear token after confirmation
        })
        .eq("confirmation_token", hashedToken)
        .eq("status", "pending")
        .select()
        .single();

      if (error || !subscriber) {
        console.error("Error confirming subscription:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Token invalide ou déjà utilisé" 
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Abonnement confirmé avec succès !" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Handle unsubscribe — REQUIRES a one-time token (sent by email).
    //   1. POST { email }            -> issue an unsubscribe token + email a confirm link
    //   2. GET/POST ?token=<plain>   -> verify token and actually unsubscribe
    if (action === "unsubscribe") {
      let unsubToken = url.searchParams.get("token") || "";
      let unsubEmailFromBody: string | undefined;

      if (!unsubToken && req.method !== "GET") {
        try {
          const body = await req.json();
          unsubToken = body?.token || "";
          unsubEmailFromBody = body?.email;
        } catch {
          // ignore – validated below
        }
      }

      if (unsubToken) {
        const hashedToken = await hashToken(unsubToken);
        const { data: updated, error } = await supabase
          .from("newsletter_subscribers")
          .update({
            status: "unsubscribed",
            unsubscribed_at: new Date().toISOString(),
            confirmation_token: null,
          })
          .eq("confirmation_token", hashedToken)
          .select()
          .single();

        if (error || !updated) {
          return new Response(
            JSON.stringify({ success: false, message: "Lien invalide ou expiré" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: "Désinscription confirmée" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Request flow — generate a token and email the confirmation link.
      // Always respond success to avoid leaking which addresses are subscribed.
      const unsubValidation = validateEmail(unsubEmailFromBody || "");
      if (!unsubValidation.valid) {
        return new Response(
          JSON.stringify({ success: false, message: "Email invalide" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const normalized = (unsubEmailFromBody as string).trim().toLowerCase();
      const { data: existing } = await supabase
        .from("newsletter_subscribers")
        .select("id, status")
        .eq("email", normalized)
        .maybeSingle();

      if (existing && existing.status !== "unsubscribed") {
        const plaintext = crypto.randomUUID();
        const hashed = await hashToken(plaintext);
        await supabase
          .from("newsletter_subscribers")
          .update({ confirmation_token: hashed })
          .eq("id", existing.id);

        const unsubUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/newsletter-subscribe?action=unsubscribe&token=${plaintext}`;
        await resend.emails.send({
          from: "jemassuremoinscher.fr <onboarding@resend.dev>",
          to: [normalized],
          subject: "Confirmez votre désinscription",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color:#6b46c1;">Confirmez votre désinscription</h1>
              <p>Pour vous désinscrire définitivement de notre newsletter, cliquez sur le bouton ci-dessous :</p>
              <div style="text-align:center;margin:30px 0;">
                <a href="${unsubUrl}" style="background:#6b46c1;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">Confirmer la désinscription</a>
              </div>
              <p style="font-size:12px;color:#999;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
            </div>
          `,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Si cet email est abonné, un lien de désinscription vient d'être envoyé.",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }


    // Handle new subscription (default action)
    const { email }: SubscribeRequest = await req.json();

    // Validate email with improved validation
    const validation = validateEmail(email);
    if (!validation.valid) {
      console.warn("Invalid email format:", validation.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email invalide" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Normalize email for consistency
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Cet email est déjà abonné à notre newsletter" 
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } else if (existingSubscriber.status === "pending") {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Un email de confirmation a déjà été envoyé. Vérifiez votre boîte mail." 
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    // Generate confirmation token (plaintext for URL, hashed for storage)
    const plaintextToken = crypto.randomUUID();
    const hashedToken = await hashToken(plaintextToken);

    // Insert new subscriber with HASHED token
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        status: "pending",
        confirmation_token: hashedToken, // Store hash, not plaintext
      });

    if (insertError) {
      console.error("Error inserting subscriber:", insertError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Erreur lors de l'inscription" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send confirmation email with PLAINTEXT token in URL
    const confirmationUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/newsletter-subscribe?action=confirm&token=${plaintextToken}`;
    
    const { error: emailError } = await resend.emails.send({
      from: "jemassuremoinscher.fr <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Confirmez votre abonnement à notre newsletter",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6b46c1; margin-bottom: 20px;">Bienvenue chez jemassuremoinscher.fr !</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Merci de vous être inscrit à notre newsletter ! Vous êtes à un clic de recevoir nos meilleurs conseils en assurance.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Pour confirmer votre abonnement, veuillez cliquer sur le bouton ci-dessous :
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #6b46c1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Confirmer mon abonnement
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Si vous n'avez pas demandé à recevoir cette newsletter, vous pouvez ignorer cet email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} jemassuremoinscher. Tous droits réservés.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Error sending confirmation email:", emailError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Erreur lors de l'envoi de l'email de confirmation" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Newsletter subscription created successfully at:", new Date().toISOString());

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Un email de confirmation a été envoyé à votre adresse" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Une erreur est survenue. Veuillez réessayer plus tard." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
