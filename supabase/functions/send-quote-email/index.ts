import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, type, details, estimatedPrice }: QuoteRequest = await req.json();

    console.log("Sending quote email for:", { name, email, type });

    // Email au propriétaire du site
    const ownerEmail = await resend.emails.send({
      from: "Comparateur Assurance <onboarding@resend.dev>",
      to: ["votre-email@exemple.com"], // Remplacez par votre email
      subject: `Nouvelle demande de devis - ${type}`,
      html: `
        <h1>Nouvelle demande de devis</h1>
        <h2>Type d'assurance: ${type}</h2>
        
        <h3>Coordonnées du client:</h3>
        <ul>
          <li><strong>Nom:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Téléphone:</strong> ${phone}</li>
        </ul>
        
        <h3>Détails de la demande:</h3>
        <pre>${JSON.stringify(details, null, 2)}</pre>
        
        <h3>Tarif estimé:</h3>
        <p style="font-size: 24px; color: #7e22ce; font-weight: bold;">${estimatedPrice}€/mois</p>
      `,
    });

    // Email au client
    const clientEmail = await resend.emails.send({
      from: "Comparateur Assurance <onboarding@resend.dev>",
      to: [email],
      subject: "Votre devis d'assurance",
      html: `
        <h1>Merci pour votre demande, ${name} !</h1>
        <p>Nous avons bien reçu votre demande de devis pour une <strong>${type}</strong>.</p>
        
        <h2>Votre tarif estimé</h2>
        <p style="font-size: 32px; color: #7e22ce; font-weight: bold;">${estimatedPrice}€/mois</p>
        
        <p>Un de nos conseillers vous contactera dans les plus brefs délais au <strong>${phone}</strong> pour finaliser votre devis.</p>
        
        <p>Cordialement,<br>L'équipe Comparateur Assurance</p>
      `,
    });

    console.log("Emails sent successfully:", { ownerEmail, clientEmail });

    return new Response(
      JSON.stringify({ 
        success: true, 
        estimatedPrice,
        ownerEmail, 
        clientEmail 
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
