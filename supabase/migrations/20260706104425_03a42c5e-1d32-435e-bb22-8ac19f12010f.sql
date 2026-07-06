DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['perfis','produtos','criativos','metricas','clientes','campanhas','publicacoes','avatares','custos','automacoes','aprendizados','conectores_api','gemini_accounts']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t) THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon', t);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t||'_anon_all', t);
      EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true)', t||'_anon_all', t);
    END IF;
  END LOOP;
END $$;