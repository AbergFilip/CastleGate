-- Lock down internal tables from client access
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.schema_migrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS deny_all_audit_logs ON public.audit_logs;
CREATE POLICY deny_all_audit_logs ON public.audit_logs
  FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS deny_all_refresh_tokens ON public.refresh_tokens;
CREATE POLICY deny_all_refresh_tokens ON public.refresh_tokens
  FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS deny_all_schema_migrations ON public.schema_migrations;
CREATE POLICY deny_all_schema_migrations ON public.schema_migrations
  FOR ALL USING (false) WITH CHECK (false);
