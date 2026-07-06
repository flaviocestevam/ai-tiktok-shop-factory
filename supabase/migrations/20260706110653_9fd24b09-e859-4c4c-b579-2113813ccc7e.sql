
-- 1. Drop tables no longer needed (cascades drop FKs and policies)
DROP TABLE IF EXISTS public.entregas CASCADE;
DROP TABLE IF EXISTS public.aprovacoes CASCADE;
DROP TABLE IF EXISTS public.campanhas CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 2. Drop role helper functions
DROP FUNCTION IF EXISTS public.is_team_member(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP TYPE IF EXISTS public.app_role;

-- 3. Simplify perfis
ALTER TABLE public.perfis
  DROP COLUMN IF EXISTS plano_mensal,
  DROP COLUMN IF EXISTS videos_contratados,
  DROP COLUMN IF EXISTS carrosseis_contratados,
  DROP COLUMN IF EXISTS cliente_id;

-- 4. Simplify produtos
ALTER TABLE public.produtos
  DROP COLUMN IF EXISTS cliente_id,
  DROP COLUMN IF EXISTS recomendacao_tipo,
  DROP COLUMN IF EXISTS facilidade_visual,
  DROP COLUMN IF EXISTS tem_antes_depois,
  DROP COLUMN IF EXISTS dor,
  DROP COLUMN IF EXISTS oferta,
  DROP COLUMN IF EXISTS publico;

-- 5. Simplify criativos (campanha_id/cliente_id already dropped via cascade)
ALTER TABLE public.criativos
  DROP COLUMN IF EXISTS campanha_id,
  DROP COLUMN IF EXISTS cliente_id,
  ADD COLUMN IF NOT EXISTS video_referencia_id uuid;

-- 6. Create videos_referencia
CREATE TABLE public.videos_referencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_tiktok text NOT NULL UNIQUE,
  produto_id uuid REFERENCES public.produtos(id) ON DELETE SET NULL,
  perfil_id uuid REFERENCES public.perfis(id) ON DELETE SET NULL,
  avatar_id uuid REFERENCES public.avatares(id) ON DELETE SET NULL,
  transcricao text,
  roteiro_adaptado text,
  gancho text,
  estrutura text,
  duracao_seg integer,
  views_estimadas integer,
  observacoes text,
  tipo_criativo text NOT NULL DEFAULT 'video' CHECK (tipo_criativo IN ('video','carrossel')),
  status text NOT NULL DEFAULT 'mapeado' CHECK (status IN ('mapeado','analisado','kit_pronto','produzido','publicado','analisando_resultado','concluido')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos_referencia TO authenticated;
GRANT ALL ON public.videos_referencia TO service_role;
ALTER TABLE public.videos_referencia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos_referencia_auth_all" ON public.videos_referencia
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER videos_referencia_updated BEFORE UPDATE ON public.videos_referencia
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

ALTER TABLE public.criativos
  ADD CONSTRAINT criativos_video_referencia_id_fkey
  FOREIGN KEY (video_referencia_id) REFERENCES public.videos_referencia(id) ON DELETE SET NULL;

-- 7. Recreate RLS across remaining tables: drop old anon + team policies, add simple authenticated policy, revoke anon
DO $$
DECLARE
  t text;
  tables text[] := ARRAY['perfis','produtos','avatares','avatar_fotos','criativos','publicacoes','metricas','custos','aprendizados','conectores_api','gemini_accounts','automacoes','profiles'];
  pol record;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
    END LOOP;
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t||'_auth_all', t);
  END LOOP;
END $$;
