
DO $$
DECLARE t text;
DECLARE tables text[] := ARRAY['aprendizados','automacoes','avatar_fotos','avatares','conectores_api','criativos','custos','gemini_accounts','metricas','perfis','produtos','profiles','publicacoes','videos_referencia'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t||'_anon_all', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true)', t||'_anon_all', t);
  END LOOP;
END $$;
