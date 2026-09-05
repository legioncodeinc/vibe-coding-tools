-- Seed `app_settings` rows referenced by the playbook.
-- Run after Phase 5 migrations. Categories: site, forms, analytics, ab_tests, notifications.

insert into app_settings (category, key, value) values
  -- Site identity (Phase 7 admin reads/writes these)
  ('site', 'name',         '"{{site-name}}"'::jsonb),
  ('site', 'tagline',      '"{{tagline}}"'::jsonb),
  ('site', 'support_email','"{{hello@example.com}}"'::jsonb),

  -- Form behavior (Phase 8)
  ('forms', 'popup_triggers',     '["exit-intent","scroll-50"]'::jsonb),
  ('forms', 'popup_delay_seconds','30'::jsonb),
  ('forms', 'lead_interests',     '["pricing","demo","integrations","other"]'::jsonb),

  -- Analytics IDs (Phase 4 — env vars are preferred, but admin-editable fallbacks live here)
  ('analytics', 'ga4_id',         '"{{G-XXXX}}"'::jsonb),
  ('analytics', 'clarity_id',     'null'::jsonb),
  ('analytics', 'fb_pixel_id',    'null'::jsonb),
  ('analytics', 'whatconverts_id','null'::jsonb),

  -- A/B tests scaffold (Phase 11)
  ('ab_tests', 'hero_headline_variant', '"control"'::jsonb),

  -- Notifications (Phase 10)
  ('notifications', 'lead_to_email', '"{{hello@example.com}}"'::jsonb)
on conflict (category, key) do nothing;
