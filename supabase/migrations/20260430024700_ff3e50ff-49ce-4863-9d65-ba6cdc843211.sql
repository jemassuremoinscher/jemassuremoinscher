drop policy if exists "Anyone can read published SEO articles" on public.seo_article_suggestions;
create policy "Anyone can read published SEO articles"
on public.seo_article_suggestions
for select
to public
using (
  status = 'approved'
  and coalesce(published_at, created_at) <= now()
  and slug not ilike '%test%'
  and title not ilike '%test%'
);

create or replace function public.queue_social_post_on_article_approval()
returns trigger
language plpgsql
security definer
set search_path = public, net
as $$
declare
  v_article_url text;
  v_image_url text := null;
  v_webhook_url text;
  v_is_active boolean;
  v_linkedin_enabled boolean;
  v_facebook_enabled boolean;
  v_existing_id uuid;
  v_request_id bigint;
  v_payload jsonb;
  v_channels jsonb := '[]'::jsonb;
  v_short_description text;
  v_published_at timestamp with time zone;
  v_should_send_now boolean;
begin
  if new.status <> 'approved' or (tg_op = 'update' and coalesce(old.status, '') = 'approved') then
    return new;
  end if;

  if new.slug ilike '%test%' or new.title ilike '%test%' then
    return new;
  end if;

  select webhook_url, is_active, linkedin_enabled, facebook_enabled
  into v_webhook_url, v_is_active, v_linkedin_enabled, v_facebook_enabled
  from public.linkedin_config
  order by created_at asc
  limit 1;

  v_webhook_url := coalesce(nullif(v_webhook_url, ''), 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7');
  v_is_active := coalesce(v_is_active, true);
  v_linkedin_enabled := coalesce(v_linkedin_enabled, true);
  v_facebook_enabled := coalesce(v_facebook_enabled, true);

  if not v_is_active then
    return new;
  end if;

  if v_linkedin_enabled then
    v_channels := v_channels || jsonb_build_array('linkedin');
  end if;
  if v_facebook_enabled then
    v_channels := v_channels || jsonb_build_array('facebook');
  end if;

  v_article_url := 'https://www.jemassuremoinscher.fr/blog/' || new.slug;
  v_image_url := nullif(new.image_url, '');
  v_short_description := coalesce(nullif(new.short_description, ''), public.build_social_short_description(new.title, new.suggested_meta_description, new.suggested_content));
  v_published_at := coalesce(new.published_at, now());
  v_should_send_now := v_published_at <= now();

  v_payload := jsonb_build_object(
    'event', 'article_inserted',
    'title', new.title,
    'short_description', v_short_description,
    'url', v_article_url,
    'article_url', v_article_url,
    'image_url', v_image_url,
    'slug', new.slug,
    'channels', v_channels,
    'provider', 'make',
    'source', 'jemassuremoinscher.fr',
    'published_at', v_published_at,
    'posted_at', case when v_should_send_now then now() else null end
  );

  select id into v_existing_id
  from public.linkedin_auto_posts
  where article_slug = new.slug
  limit 1;

  if v_should_send_now then
    select net.http_post(
      url := v_webhook_url,
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := v_payload,
      timeout_milliseconds := 5000
    ) into v_request_id;
  end if;

  if v_existing_id is null then
    insert into public.linkedin_auto_posts (
      article_slug, article_title, article_url, image_url, short_description, post_content,
      provider, status, linkedin_status, facebook_status, posted_at, error_message, response_payload
    ) values (
      new.slug, new.title, v_article_url, v_image_url, v_short_description, new.suggested_meta_description,
      'make',
      case when v_should_send_now then 'posted' else 'pending' end,
      case when not v_linkedin_enabled then 'disabled' when v_should_send_now then 'posted' else 'pending' end,
      case when not v_facebook_enabled then 'disabled' when v_should_send_now then 'posted' else 'pending' end,
      case when v_should_send_now then now() else null end,
      null,
      jsonb_build_object('make_request_id', v_request_id, 'delivery', case when v_should_send_now then 'queued_by_database' else 'scheduled_by_database' end, 'payload', v_payload)
    );
  else
    update public.linkedin_auto_posts
    set article_title = new.title,
        article_url = v_article_url,
        image_url = v_image_url,
        short_description = v_short_description,
        post_content = coalesce(post_content, new.suggested_meta_description),
        provider = 'make',
        status = case when v_should_send_now then 'posted' else 'pending' end,
        linkedin_status = case when not v_linkedin_enabled then 'disabled' when v_should_send_now then 'posted' else 'pending' end,
        facebook_status = case when not v_facebook_enabled then 'disabled' when v_should_send_now then 'posted' else 'pending' end,
        posted_at = case when v_should_send_now then now() else posted_at end,
        error_message = null,
        response_payload = jsonb_build_object('make_request_id', v_request_id, 'delivery', case when v_should_send_now then 'queued_by_database' else 'scheduled_by_database' end, 'payload', v_payload)
    where id = v_existing_id;
  end if;

  return new;
exception when others then
  insert into public.linkedin_auto_posts (
    article_slug, article_title, article_url, image_url, short_description, post_content,
    provider, status, linkedin_status, facebook_status, error_message, response_payload
  ) values (
    new.slug, new.title, coalesce(v_article_url, 'https://www.jemassuremoinscher.fr/blog/' || new.slug), v_image_url,
    coalesce(v_short_description, public.build_social_short_description(new.title, new.suggested_meta_description, new.suggested_content)),
    new.suggested_meta_description, 'make', 'failed', 'failed', 'failed', sqlerrm,
    jsonb_build_object('delivery', 'database_trigger_failed')
  )
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists trg_queue_social_post_on_article_approval on public.seo_article_suggestions;
create trigger trg_queue_social_post_on_article_approval
after insert or update of status on public.seo_article_suggestions
for each row
execute function public.queue_social_post_on_article_approval();