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

    // Handle email confirmation
    if (action === "confirm") {
      const { token }: ConfirmRequest = await req.json();
      
      const { data: subscriber, error } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "active",
          confirmed_at: new Date().toISOString(),
          confirmation_token: null,
        })
        .eq("confirmation_token", token)
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

    // Handle unsubscribe
    if (action === "unsubscribe") {
      const { email }: UnsubscribeRequest = await req.json();
      
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "unsubscribed",
          unsubscribed_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (error) {
        console.error("Error unsubscribing:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Erreur lors de la désinscription" 
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Désinscription réussie" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
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

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        status: "pending",
        confirmation_token: confirmationToken,
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

    // Send confirmation email
    const confirmationUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/newsletter-subscribe?action=confirm`;
    
    const { error: emailError } = await resend.emails.send({
      from: "Le Comparateur Assurance <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Confirmez votre abonnement à notre newsletter",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6b46c1; margin-bottom: 20px;">Bienvenue chez Le Comparateur Assurance !</h1>
          
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
            © ${new Date().getFullYear()} Le Comparateur Assurance. Tous droits réservés.
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
