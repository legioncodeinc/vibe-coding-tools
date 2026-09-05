-- RLS policy skeleton (Phase 5) — SvelteKit + Payload + Supabase build
-- Pattern: enable RLS on every public-schema table, then grant explicitly.
--
-- DUAL NAMESPACE DESIGN:
-- public.*     → RLS is mandatory here; Supabase anon key can read these tables.
-- payload.*    → Payload owns this schema via @payloadcms/db-postgres adapter.
--               DO NOT enable RLS on payload.* tables — Payload enforces access
--               control in its own layer. The Payload DB connection bypasses RLS
--               (uses a privileged role). Supabase anon key cannot access payload.*
--               because the anon key's search_path does not include the payload schema.
--
-- To verify payload schema isolation:
--   SELECT current_schemas(true);  -- confirm 'payload' is not in anon search_path

-- ─── public schema: enable RLS on all tables ─────────────────────────────────

ALTER TABLE public.app_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_endpoints    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries   ENABLE ROW LEVEL SECURITY;

-- ─── profiles: read own row; admins read all ─────────────────────────────────

CREATE POLICY "profiles_self_select"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_admin_select"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin')
    )
  );

CREATE POLICY "profiles_self_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Role changes require admin — handled by admin-users Edge Function (service role)

-- ─── leads: anon insert; admin+editor select ─────────────────────────────────

CREATE POLICY "leads_anon_insert"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "leads_editor_select"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

-- ─── app_settings: authenticated select; mutate via Edge Function (service role) ──

CREATE POLICY "settings_auth_select"
  ON public.app_settings FOR SELECT
  USING (auth.role() = 'authenticated');

-- NOTE: app_settings updates are performed by Supabase Edge Functions using the
-- service role key, which bypasses RLS. Never grant direct UPDATE to anon or authenticated.

-- ─── webhook_endpoints + webhook_deliveries: admin only ──────────────────────

CREATE POLICY "webhook_endpoints_admin_all"
  ON public.webhook_endpoints FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "webhook_deliveries_admin_select"
  ON public.webhook_deliveries FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ─── Payload schema isolation verification (run after Payload first start) ───

-- Verify Payload tables are NOT accessible via anon key:
-- SELECT COUNT(*) FROM payload.payload_migrations;
-- Expected: ERROR: permission denied for schema payload

-- Verify payload schema exists:
-- SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'payload';
-- Expected: payload
