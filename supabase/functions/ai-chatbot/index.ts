// @ts-ignore: Deno runtime

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: track requests by IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

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

// Message validation types and functions
interface ValidatedMessage {
  role: 'user' | 'assistant';
  content: string;
}

function validateMessages(messages: unknown): ValidatedMessage[] {
  // Check if messages is an array
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }
  
  if (messages.length === 0) {
    throw new Error('Messages array cannot be empty');
  }
  
  // Limit number of messages to prevent abuse
  if (messages.length > 50) {
    throw new Error('Too many messages in conversation');
  }
  
  return messages.map((msg, index) => {
    // Validate message structure
    if (!msg || typeof msg !== 'object') {
      throw new Error(`Invalid message at index ${index}`);
    }
    
    // Validate role
    if (!msg.role || (msg.role !== 'user' && msg.role !== 'assistant')) {
      throw new Error(`Invalid role at message ${index}`);
    }
    
    // Validate content exists and is a string
    if (typeof msg.content !== 'string') {
      throw new Error(`Message content must be a string at index ${index}`);
    }
    
    // Validate content length
    const content = msg.content.trim();
    if (content.length === 0) {
      throw new Error(`Message content cannot be empty at index ${index}`);
    }
    
    if (content.length > 2000) {
      throw new Error(`Message too long at index ${index} (max 2000 characters)`);
    }
    
    // Return sanitized message
    return {
      role: msg.role as 'user' | 'assistant',
      content: content.substring(0, 2000), // Enforce max length
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require a valid Supabase JWT (anon session is fine) to prevent unauthenticated abuse
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentification requise.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    try {
      // @ts-ignore: Deno
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      // @ts-ignore: Deno
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Session invalide.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (_e) {
      return new Response(
        JSON.stringify({ error: 'Session invalide.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting (best-effort; resets on cold start)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }


    const body = await req.json();
    
    // Validate and sanitize messages
    let messages: ValidatedMessage[];
    try {
      messages = validateMessages(body.messages);
    } catch (validationError) {
      console.error('Message validation failed:', validationError);
      return new Response(
        JSON.stringify({ error: 'Format de message invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Validated messages count:', messages.length);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    const systemPrompt = `Tu es Arthur, la mascotte super-héros de jemassuremoinscher.fr — le comparateur d'assurances N°1 en France. Tu es un petit personnage enthousiaste, bienveillant et un peu espiègle, qui adore aider les gens à économiser sur leurs assurances.

Personnalité d'Arthur :
- Tu parles à la première personne : "Moi, Arthur, je vais t'expliquer !"
- Tu utilises des émojis avec parcimonie mais de façon fun (💪, 🦸‍♂️, 💡, 🎯, 😉)
- Tu es toujours optimiste et rassurant : "T'inquiète, on va trouver le meilleur deal ensemble !"
- Tu aimes te présenter comme le "super-héros des économies"
- Tu es direct et concis (2-3 phrases max), mais toujours chaleureux
- Tu tutoies l'utilisateur naturellement
- Tu ponctues tes réponses avec des petites touches d'humour léger

Ton rôle :
- Aider les visiteurs à comprendre les assurances (auto, moto, habitation, santé, prêt, vie, prévoyance, animaux, MRP, RC Pro, GLI, PNO)
- Comparer les offres et orienter vers le bon formulaire de devis
- Expliquer les lois (Hamon, Lemoine) de façon simple et accessible
- Toujours suggérer l'étape suivante ("Tu veux que je te trouve un devis ? 🎯")

Règles :
- Ne donne JAMAIS de prix exact, parle de fourchettes ou suggère une comparaison
- Si une question est trop complexe, recommande un rappel : "Là, c'est du lourd ! Je te conseille de demander un rappel à mes collègues experts 💪"
- Termine toujours par une question ou une suggestion d'action
- Signe parfois tes messages avec "— Arthur 🦸‍♂️" quand c'est naturel`;


    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Notre assistant est temporairement surchargé. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporairement indisponible.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const assistantMessage = data.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue. Veuillez réessayer.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
