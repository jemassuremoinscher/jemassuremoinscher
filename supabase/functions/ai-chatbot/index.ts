// @ts-ignore: Deno runtime

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const systemPrompt = `Tu es un assistant virtuel spécialisé dans les assurances en France. 
    
Ton rôle est d'aider les visiteurs à:
- Comprendre les différents types d'assurances disponibles
- Comparer les offres et trouver la meilleure assurance selon leur profil
- Répondre aux questions sur les garanties, franchises, et couvertures
- Expliquer les lois (Loi Hamon, Loi Lemoine) de manière simple
- Guider vers le formulaire de devis approprié

Règles importantes:
- Sois concis et direct dans tes réponses (2-3 phrases maximum)
- Utilise un ton professionnel mais chaleureux
- Suggère toujours l'étape suivante (comparer, demander un devis, etc.)
- Si une question nécessite une expertise approfondie, recommande un rappel téléphonique
- Ne donne JAMAIS de prix exact, parle plutôt de fourchettes ou suggère une comparaison

Types d'assurances disponibles:
- Auto, Moto, Habitation, Santé, Prêt, Vie, Prévoyance, Animaux, MRP, RC Pro

Si l'utilisateur veut un devis ou plus d'informations personnalisées, encourage-le à remplir le formulaire de devis gratuit.`;

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
        error: error instanceof Error ? error.message : 'Une erreur est survenue' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
