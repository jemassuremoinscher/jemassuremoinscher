import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this is a manual trigger (with auth) or cron trigger
    const authHeader = req.headers.get("Authorization");
    let isManual = false;
    let manualSlug: string | null = null;

    if (authHeader && !authHeader.includes(Deno.env.get("SUPABASE_ANON_KEY")!)) {
      // Manual trigger from admin - verify admin role
      const { data: { user }, error: authError } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", "")
      );
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: hasAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!hasAdmin) {
        return new Response(JSON.stringify({ error: "Admin requis" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      isManual = true;
      try {
        const body = await req.json();
        manualSlug = body?.slug || null;
      } catch {
        // No body = post next unposted article
      }
    }

    // Get config
    const { data: config, error: configError } = await supabase
      .from("linkedin_config")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (configError || !config) {
      return new Response(
        JSON.stringify({ error: "Aucune configuration LinkedIn trouvée. Configurez le webhook dans le back-office." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!config.is_active && !isManual) {
      return new Response(
        JSON.stringify({ message: "Publication LinkedIn désactivée" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get already posted slugs
    const { data: postedArticles } = await supabase
      .from("linkedin_auto_posts")
      .select("article_slug")
      .eq("status", "posted");

    const postedSlugs = new Set((postedArticles || []).map((a: any) => a.article_slug));

    // Fetch all articles from the hardcoded data endpoint
    // We'll pass the slug to post or pick the next unposted one
    let targetSlug = manualSlug;
    let targetTitle = "";
    let targetDescription = "";
    let targetShortDescription = "";
    let targetCategory = "";
    let targetArticleUrl = "";
    let targetImageUrl: string | null = null;

    if (targetSlug) {
      const { data: queuedPost } = await supabase
        .from("linkedin_auto_posts")
        .select("*")
        .eq("article_slug", targetSlug)
        .in("status", ["pending", "failed"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (queuedPost) {
        targetTitle = queuedPost.article_title || "";
        targetDescription = queuedPost.post_content || "";
        targetShortDescription = queuedPost.short_description || "";
        targetArticleUrl = queuedPost.article_url || "";
        targetImageUrl = queuedPost.image_url || null;
      }
    }

    if (!targetSlug) {
      // Get articles list from the blog data - we need to call the app
      // Since articles are hardcoded, we pass them from the admin UI
      // For cron: we store article metadata in the post record
      // Alternative: fetch the sitemap or hardcode the article list
      
      // For cron jobs, we'll use a different approach:
      // The admin UI will queue articles for posting
      const { data: pendingRows } = await supabase
        .from("linkedin_auto_posts")
        .select("*")
        .eq("status", "pending")
        .not("article_slug", "ilike", "%test%")
        .order("created_at", { ascending: true })
        .limit(10);

      const nowIso = new Date().toISOString();
      const pendingPosts = (pendingRows || []).find((post: any) => !post.scheduled_at || post.scheduled_at <= nowIso) || null;

      if (!pendingPosts) {
        return new Response(
          JSON.stringify({ message: "Aucun article en attente de publication" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      targetSlug = pendingPosts.article_slug;
      targetTitle = pendingPosts.article_title;
      targetArticleUrl = pendingPosts.article_url || "";
      targetImageUrl = pendingPosts.image_url || null;
      targetShortDescription = pendingPosts.short_description || "";
      // Use stored content or generate default
      targetDescription = pendingPosts.post_content || "";
    }

    const buildPunchyShortDescription = (title: string, fallback: string) => {
      const base = (title || fallback || "votre assurance")
        .replace(/^#+\s*/, "")
        .replace(/\s*[:|–-]\s*(guide|comparatif|définition|conseils).*$/i, "")
        .trim()
        .slice(0, 95);
      return `🚨 Et si ${base.toLowerCase() || "votre assurance"} vous coûtait plus cher que prévu ? La réponse ici ⬇️`;
    };

    const normalizeShortDescription = (raw: string, title: string, fallback: string) => {
      const cleaned = raw.replace(/["“”]/g, "").replace(/\s+/g, " ").trim();
      const sentenceCount = cleaned.split(/[.!?…]+\s+/).filter(Boolean).length;
      const startsPunchy = /^[🚨⚡️🔥💥🛑]/.test(cleaned);
      const hasCta = /(ici|erreur|réponse|découvrez|cliquez|⬇️)/i.test(cleaned);
      if (!startsPunchy || !hasCta || sentenceCount > 2) return buildPunchyShortDescription(title, fallback);
      return cleaned.slice(0, 220);
    };

    // Build social post content for Make.com (LinkedIn + Facebook)
    const siteUrl = "https://jemassuremoinscher.fr";
    const articleUrl = targetArticleUrl || `${siteUrl}/blog/${targetSlug}`;
    
    const postContent = targetDescription || 
      `📰 Nouvel article sur jemassuremoinscher.fr !\n\n` +
      `${targetTitle}\n\n` +
      `👉 Lire l'article complet : ${articleUrl}\n\n` +
      `#assurance #comparateur #économies #jemassuremoinscher`;
    const shortDescription = normalizeShortDescription(targetShortDescription, targetTitle, targetDescription);

    // Send to Zapier webhook
    try {
      const makeResponse = await fetch(config.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "article_inserted",
          title: targetTitle,
          short_description: shortDescription,
          content: postContent,
          url: articleUrl,
          article_url: articleUrl,
          image_url: targetImageUrl,
          slug: targetSlug,
          channels: ["linkedin", "facebook"],
          provider: "make",
          posted_at: new Date().toISOString(),
        }),
      });

      if (!makeResponse.ok) {
        const errorText = await makeResponse.text();
        // Update status to failed
        await supabase
          .from("linkedin_auto_posts")
          .update({
            status: "failed",
            linkedin_status: "failed",
            facebook_status: "failed",
            error_message: `Make.com error ${makeResponse.status}: ${errorText}`,
          })
          .eq("article_slug", targetSlug)
          .eq("status", "pending");

        return new Response(
          JSON.stringify({ error: `Échec Make.com: ${makeResponse.status}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update status to posted
      await supabase
        .from("linkedin_auto_posts")
        .update({
          status: "posted",
          linkedin_status: "posted",
          facebook_status: "posted",
          posted_at: new Date().toISOString(),
          short_description: shortDescription,
        })
        .eq("article_slug", targetSlug)
        .eq("status", "pending");

      return new Response(
        JSON.stringify({ success: true, slug: targetSlug, message: `Article "${targetTitle}" envoyé à Make.com pour LinkedIn et Facebook` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : "Erreur réseau";
      await supabase
        .from("linkedin_auto_posts")
        .update({
          status: "failed",
            linkedin_status: "failed",
            facebook_status: "failed",
          error_message: errorMsg,
        })
        .eq("article_slug", targetSlug)
        .eq("status", "pending");

      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    console.error("post-to-linkedin error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
