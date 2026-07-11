
-- 1) Novos campos de mídia
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS foto_principal_url TEXT;
ALTER TABLE public.avatares ADD COLUMN IF NOT EXISTS foto_canonica_url TEXT;

-- 2) Tabela geracoes_video
CREATE TABLE IF NOT EXISTS public.geracoes_video (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referencia_id UUID REFERENCES public.videos_referencia(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  avatar_id UUID REFERENCES public.avatares(id) ON DELETE SET NULL,
  runpod_job_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  video_url TEXT,
  custo_usd NUMERIC(10,4),
  tempo_execucao_ms INTEGER,
  erro TEXT,
  workflow_snapshot JSONB,
  input_payload JSONB,
  iniciado_em TIMESTAMPTZ,
  concluido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.geracoes_video TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.geracoes_video TO anon;
GRANT ALL ON public.geracoes_video TO service_role;

ALTER TABLE public.geracoes_video ENABLE ROW LEVEL SECURITY;

CREATE POLICY "geracoes_video_anon_all" ON public.geracoes_video FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "geracoes_video_auth_all" ON public.geracoes_video FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_geracoes_video_referencia ON public.geracoes_video(referencia_id);
CREATE INDEX IF NOT EXISTS idx_geracoes_video_status ON public.geracoes_video(status);
CREATE INDEX IF NOT EXISTS idx_geracoes_video_job ON public.geracoes_video(runpod_job_id);

CREATE TRIGGER trg_geracoes_video_updated_at
BEFORE UPDATE ON public.geracoes_video
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3) Storage policies para os 3 buckets internos
CREATE POLICY "media_buckets_read"
ON storage.objects FOR SELECT
USING (bucket_id IN ('avatar-fotos','produto-fotos','videos-gerados'));

CREATE POLICY "media_buckets_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('avatar-fotos','produto-fotos','videos-gerados'));

CREATE POLICY "media_buckets_update"
ON storage.objects FOR UPDATE
USING (bucket_id IN ('avatar-fotos','produto-fotos','videos-gerados'))
WITH CHECK (bucket_id IN ('avatar-fotos','produto-fotos','videos-gerados'));

CREATE POLICY "media_buckets_delete"
ON storage.objects FOR DELETE
USING (bucket_id IN ('avatar-fotos','produto-fotos','videos-gerados'));
