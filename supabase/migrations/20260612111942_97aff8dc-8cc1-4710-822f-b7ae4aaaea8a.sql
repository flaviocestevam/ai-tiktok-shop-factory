
-- ============================================================
-- ROLES & PROFILES
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'operador');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Updated-at trigger function
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$ BEGIN
  INSERT INTO public.profiles (id, email, nome)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: "team member" = anyone authenticated (admin or operador)
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'operador') $$;

-- ============================================================
-- PERFIS PRÓPRIOS
-- ============================================================
CREATE TABLE public.perfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  nicho TEXT,
  pais TEXT,
  plataforma TEXT DEFAULT 'TikTok Shop',
  status TEXT NOT NULL DEFAULT 'ativo',
  descricao TEXT,
  avatar_principal TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfis_team_all" ON public.perfis FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));
CREATE TRIGGER perfis_updated BEFORE UPDATE ON public.perfis FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- CLIENTES
-- ============================================================
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa TEXT NOT NULL,
  contato_nome TEXT,
  contato_email TEXT,
  contato_whatsapp TEXT,
  nicho TEXT,
  pais TEXT,
  plano_mensal NUMERIC(12,2) DEFAULT 0,
  videos_contratados INTEGER DEFAULT 0,
  carrosseis_contratados INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clientes_team_all" ON public.clientes FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));
CREATE TRIGGER clientes_updated BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- PRODUTOS
-- ============================================================
CREATE TABLE public.produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  nicho TEXT,
  pais TEXT,
  preco NUMERIC(12,2),
  comissao_pct NUMERIC(5,2),
  dor TEXT,
  oferta TEXT,
  publico TEXT,
  facilidade_visual INTEGER DEFAULT 50,
  tem_antes_depois BOOLEAN DEFAULT false,
  recomendacao_tipo TEXT,
  score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo',
  link_tiktok TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX produtos_perfil_idx ON public.produtos(perfil_id);
CREATE INDEX produtos_cliente_idx ON public.produtos(cliente_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "produtos_team_all" ON public.produtos FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));
CREATE TRIGGER produtos_updated BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- AVATARES (com biblioteca de fotos canônicas)
-- ============================================================
CREATE TABLE public.avatares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  origem TEXT NOT NULL DEFAULT 'canônico',
  genero TEXT,
  idade_estimada TEXT,
  pais TEXT,
  estilo TEXT,
  nichos TEXT[] DEFAULT '{}',
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avatares TO authenticated;
GRANT ALL ON public.avatares TO service_role;
ALTER TABLE public.avatares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avatares_team_all" ON public.avatares FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));
CREATE TRIGGER avatares_updated BEFORE UPDATE ON public.avatares FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.avatar_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_id UUID NOT NULL REFERENCES public.avatares(id) ON DELETE CASCADE,
  posicao TEXT NOT NULL,
  storage_path TEXT,
  url TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX avatar_fotos_avatar_idx ON public.avatar_fotos(avatar_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avatar_fotos TO authenticated;
GRANT ALL ON public.avatar_fotos TO service_role;
ALTER TABLE public.avatar_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avatar_fotos_team_all" ON public.avatar_fotos FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));

-- ============================================================
-- CAMPANHAS
-- ============================================================
CREATE TABLE public.campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('uso_proprio','cliente')),
  perfil_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  avatar_id UUID REFERENCES public.avatares(id) ON DELETE SET NULL,
  objetivo TEXT,
  pais TEXT,
  nicho TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  formatos JSONB DEFAULT '[]'::jsonb,
  qtd_videos INTEGER DEFAULT 0,
  qtd_carrosseis INTEGER DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX campanhas_perfil_idx ON public.campanhas(perfil_id);
CREATE INDEX campanhas_cliente_idx ON public.campanhas(cliente_id);
CREATE INDEX campanhas_produto_idx ON public.campanhas(produto_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campanhas TO authenticated;
GRANT ALL ON public.campanhas TO service_role;
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campanhas_team_all" ON public.campanhas FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));
CREATE TRIGGER campanhas_updated BEFORE UPDATE ON public.campanhas FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- CONTAS GEMINI
-- ============================================================
CREATE TABLE public.gemini_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  api_key_masked TEXT NOT NULL,
  api_key_secret_name TEXT,
  gcp_project TEXT,
  usos TEXT[] DEFAULT '{imagem,vídeo,texto}',
  status TEXT NOT NULL DEFAULT 'reserva',
  prioridade INTEGER NOT NULL DEFAULT 99,
  orcamento NUMERIC(12,2) DEFAULT 0,
  uso_estimado NUMERIC(12,2) DEFAULT 0,
  limite_diario NUMERIC(12,2) DEFAULT 0,
  alerta_pct INTEGER DEFAULT 80,
  ultimo_uso TIMESTAMPTZ,
  ultimo_erro TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gemini_accounts TO authenticated;
GRANT ALL ON public.gemini_accounts TO service_role;
ALTER TABLE public.gemini_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gemini_admin_all" ON public.gemini_accounts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "gemini_team_read" ON public.gemini_accounts FOR SELECT TO authenticated
  USING (public.is_team_member(auth.uid()));
CREATE TRIGGER gemini_updated BEFORE UPDATE ON public.gemini_accounts FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- CRIATIVOS
-- ============================================================
CREATE TABLE public.criativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  perfil_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  avatar_id UUID REFERENCES public.avatares(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('vídeo','carrossel')),
  formato TEXT,
  titulo TEXT,
  gancho TEXT,
  cta TEXT,
  roteiro TEXT,
  duracao_seg INTEGER,
  num_slides INTEGER,
  arquivo_url TEXT,
  legenda TEXT,
  status TEXT NOT NULL DEFAULT 'em produção',
  gemini_account_id UUID REFERENCES public.gemini_accounts(id) ON DELETE SET NULL,
  classificacao_comercial TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX criativos_campanha_idx ON public.criativos(campanha_id);
CREATE INDEX criativos_produto_idx ON public.criativos(produto_id);
CREATE INDEX criativos_status_idx ON public.criativos(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.criativos TO authenticated;
GRANT ALL ON public.criativos TO service_role;
ALTER TABLE public.criativos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "criativos_team_all" ON public.criativos FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));
CREATE TRIGGER criativos_updated BEFORE UPDATE ON public.criativos FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- PUBLICAÇÕES
-- ============================================================
CREATE TABLE public.publicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criativo_id UUID NOT NULL REFERENCES public.criativos(id) ON DELETE CASCADE,
  perfil_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  tiktok_video_id TEXT,
  tiktok_url TEXT,
  publicado_em TIMESTAMPTZ,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX publicacoes_criativo_idx ON public.publicacoes(criativo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publicacoes TO authenticated;
GRANT ALL ON public.publicacoes TO service_role;
ALTER TABLE public.publicacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "publicacoes_team_all" ON public.publicacoes FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));

-- ============================================================
-- MÉTRICAS (snapshots por publicação)
-- ============================================================
CREATE TABLE public.metricas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publicacao_id UUID NOT NULL REFERENCES public.publicacoes(id) ON DELETE CASCADE,
  capturado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comentarios INTEGER DEFAULT 0,
  compartilhamentos INTEGER DEFAULT 0,
  cliques INTEGER DEFAULT 0,
  vendas INTEGER DEFAULT 0,
  receita NUMERIC(12,2) DEFAULT 0,
  origem TEXT
);
CREATE INDEX metricas_publicacao_idx ON public.metricas(publicacao_id, capturado_em DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.metricas TO authenticated;
GRANT ALL ON public.metricas TO service_role;
ALTER TABLE public.metricas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "metricas_team_all" ON public.metricas FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));

-- ============================================================
-- CUSTOS
-- ============================================================
CREATE TYPE public.cost_type AS ENUM (
  'script_generation','image_generation','video_generation','carousel_generation',
  'voice_generation','rendering','storage','transcription','analysis','retry','manual_review'
);

CREATE TABLE public.custos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE SET NULL,
  criativo_id UUID REFERENCES public.criativos(id) ON DELETE SET NULL,
  provider_account_id UUID REFERENCES public.gemini_accounts(id) ON DELETE SET NULL,
  provider_name TEXT NOT NULL,
  cost_type public.cost_type NOT NULL,
  quantity NUMERIC(12,4) NOT NULL DEFAULT 1,
  unit_cost NUMERIC(12,6) NOT NULL DEFAULT 0,
  total_cost NUMERIC(12,4) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX custos_campanha_idx ON public.custos(campanha_id);
CREATE INDEX custos_perfil_idx ON public.custos(perfil_id);
CREATE INDEX custos_cliente_idx ON public.custos(cliente_id);
CREATE INDEX custos_data_idx ON public.custos(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custos TO authenticated;
GRANT ALL ON public.custos TO service_role;
ALTER TABLE public.custos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "custos_team_all" ON public.custos FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));

-- ============================================================
-- APROVAÇÕES INTERNAS
-- ============================================================
CREATE TABLE public.aprovacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade_tipo TEXT NOT NULL,
  entidade_id UUID NOT NULL,
  etapa TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  observacao TEXT,
  decidido_por UUID REFERENCES auth.users(id),
  decidido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX aprovacoes_entidade_idx ON public.aprovacoes(entidade_tipo, entidade_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aprovacoes TO authenticated;
GRANT ALL ON public.aprovacoes TO service_role;
ALTER TABLE public.aprovacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aprovacoes_team_all" ON public.aprovacoes FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));

-- ============================================================
-- ENTREGAS PARA CLIENTES
-- ============================================================
CREATE TABLE public.entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  qtd_videos INTEGER DEFAULT 0,
  qtd_carrosseis INTEGER DEFAULT 0,
  qtd_total INTEGER DEFAULT 0,
  pacote_url TEXT,
  data_entrega DATE,
  status TEXT NOT NULL DEFAULT 'em_andamento',
  observacoes TEXT,
  custo_total NUMERIC(12,2) DEFAULT 0,
  receita NUMERIC(12,2) DEFAULT 0,
  lucro NUMERIC(12,2) DEFAULT 0,
  margem NUMERIC(5,2) DEFAULT 0,
  relatorio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX entregas_cliente_idx ON public.entregas(cliente_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entregas TO authenticated;
GRANT ALL ON public.entregas TO service_role;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entregas_team_all" ON public.entregas FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));
CREATE TRIGGER entregas_updated BEFORE UPDATE ON public.entregas FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- AUTOMAÇÕES
-- ============================================================
CREATE TABLE public.automacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger TEXT NOT NULL,
  acao TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.automacoes TO authenticated;
GRANT ALL ON public.automacoes TO service_role;
ALTER TABLE public.automacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "automacoes_admin_all" ON public.automacoes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "automacoes_team_read" ON public.automacoes FOR SELECT TO authenticated
  USING (public.is_team_member(auth.uid()));
CREATE TRIGGER automacoes_updated BEFORE UPDATE ON public.automacoes FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- BASE DE CONHECIMENTO (inteligência da fábrica)
-- ============================================================
CREATE TABLE public.aprendizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL,
  titulo TEXT NOT NULL,
  detalhe TEXT,
  evidencia JSONB DEFAULT '{}'::jsonb,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  avatar_id UUID REFERENCES public.avatares(id) ON DELETE SET NULL,
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE SET NULL,
  nicho TEXT,
  formato TEXT,
  peso INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX aprendizados_categoria_idx ON public.aprendizados(categoria);
CREATE INDEX aprendizados_nicho_idx ON public.aprendizados(nicho);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aprendizados TO authenticated;
GRANT ALL ON public.aprendizados TO service_role;
ALTER TABLE public.aprendizados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aprendizados_team_all" ON public.aprendizados FOR ALL TO authenticated
  USING (public.is_team_member(auth.uid())) WITH CHECK (public.is_team_member(auth.uid()));

-- ============================================================
-- CONECTORES API (TikTok Shop Partner/Affiliate/Developer)
-- ============================================================
CREATE TABLE public.conectores_api (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  perfil_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'desconectado',
  config JSONB DEFAULT '{}'::jsonb,
  secret_name TEXT,
  ultima_sync TIMESTAMPTZ,
  ultimo_erro TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conectores_api TO authenticated;
GRANT ALL ON public.conectores_api TO service_role;
ALTER TABLE public.conectores_api ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conectores_admin_all" ON public.conectores_api FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "conectores_team_read" ON public.conectores_api FOR SELECT TO authenticated
  USING (public.is_team_member(auth.uid()));
CREATE TRIGGER conectores_updated BEFORE UPDATE ON public.conectores_api FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
