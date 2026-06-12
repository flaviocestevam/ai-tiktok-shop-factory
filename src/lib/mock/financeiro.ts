// Mocks para Custos, Contas Gemini, Inteligência da Fábrica e Automações

export type CostType =
  | "script_generation" | "image_generation" | "video_generation"
  | "carousel_generation" | "voice_generation" | "rendering"
  | "storage" | "transcription" | "analysis" | "retry" | "manual_review";

export type CustoRow = {
  id: string;
  profile_id?: string;
  client_id?: string;
  campaign_id?: string;
  creative_id?: string;
  provider_account_id?: string;
  provider_name: string;
  cost_type: CostType;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  currency: "BRL";
  status: "ok" | "pendente" | "erro";
  created_at: string;
};

export const custosBreakdown = {
  campanha: {
    nome: "Mini seladora",
    videosGerados: 10, carrosseisGerados: 5, criativosPublicados: 12,
    items: [
      { label: "Roteiro", value: 3 },
      { label: "Fotos", value: 45 },
      { label: "Vídeo IA", value: 180 },
      { label: "Carrossel", value: 20 },
      { label: "Voz", value: 20 },
      { label: "Render", value: 25 },
      { label: "Storage", value: 2 },
    ],
    total: 295, receita: 3600, lucro: 3305, roi: 1120,
    custoPorCriativo: 24.58, custoPorVenda: 1.63,
  },
  perfil: {
    nome: "Casa Inteligente", periodo: "mês atual",
    produzidos: 120, publicados: 100, custoTotal: 300,
    medioProduzido: 2.5, medioPublicado: 3.0,
    comissao: 4200, lucro: 3900, roi: 1300,
  },
  cliente: {
    nome: "Loja X", plano: 1997, contratados: 30, entregues: 30,
    custoTotal: 420, receita: 1997, lucroBruto: 1577, margem: 79,
    medioCriativo: 14, precoMedio: 66.56,
  },
  geral: {
    custoIA: 2300, custoStorage: 120, custoFerramentas: 1200,
    custoOperacional: 3620, receitaClientes: 12000, comissaoPerfis: 8000,
    receitaTotal: 20000, lucro: 16380, margem: 81.9,
  },
};

export type GeminiAccount = {
  id: string;
  nome: string;
  apiKeyMasked: string;
  gcpProject: string;
  usos: ("imagem" | "vídeo" | "texto")[];
  status: "ativa" | "reserva" | "pausada" | "sem crédito" | "limite diário" | "erro" | "aguardando";
  prioridade: number;
  orcamento: number;
  usoEstimado: number;
  limiteDiario: number;
  alertaPct: number;
  ultimoUso: string;
  ultimoErro?: string;
  cadastradoEm: string;
};

export const geminiAccounts: GeminiAccount[] = [
  {
    id: "gem-1", nome: "Gemini Principal", apiKeyMasked: "AIza****8F3A",
    gcpProject: "video-factory-prod", usos: ["imagem", "vídeo", "texto"],
    status: "ativa", prioridade: 1, orcamento: 300, usoEstimado: 240,
    limiteDiario: 50, alertaPct: 80,
    ultimoUso: "há 3 min", cadastradoEm: "2025-09-01",
  },
  {
    id: "gem-2", nome: "Gemini 2", apiKeyMasked: "AIza****2C71",
    gcpProject: "video-factory-reserva", usos: ["imagem", "vídeo"],
    status: "reserva", prioridade: 2, orcamento: 300, usoEstimado: 12,
    limiteDiario: 50, alertaPct: 80,
    ultimoUso: "ontem", cadastradoEm: "2025-10-14",
  },
];

export type ClassificacaoCriativo =
  | "Campeão eficiente" | "Campeão de volume" | "Bom, mas caro"
  | "Chama atenção, mas não vende" | "Produto bom, criativo fraco" | "Ineficiência total";

export const classificacoes: { tipo: ClassificacaoCriativo; desc: string; acao: string; cor: string }[] = [
  { tipo: "Campeão eficiente", desc: "Poucas views, muitas vendas, baixo custo.", acao: "Escalar imediatamente.", cor: "success" },
  { tipo: "Campeão de volume", desc: "Muitas views e muitas vendas.", acao: "Escalar, monitorar custo.", cor: "success" },
  { tipo: "Bom, mas caro", desc: "Vende, mas custa muito.", acao: "Criar versão carrossel mais barata.", cor: "warning" },
  { tipo: "Chama atenção, mas não vende", desc: "Muita view, pouco clique/venda.", acao: "Corrigir CTA, promessa ou produto.", cor: "warning" },
  { tipo: "Produto bom, criativo fraco", desc: "Pouca view, boa conversão.", acao: "Criar novos ganchos e formatos.", cor: "primary" },
  { tipo: "Ineficiência total", desc: "Pouca view, pouco clique, pouca venda.", acao: "Pausar.", cor: "destructive" },
];

export const saturacaoSinais = [
  "Views caindo", "Cliques caindo", "Vendas caindo",
  "Custo por venda subindo", "ROI caindo", "Mesmo produto repetido",
  "Mesmo gancho perdendo força", "Mesmo formato performando pior",
];

export const produtosIrmaos: Record<string, string[]> = {
  "Mini seladora": ["Potes organizadores", "Clips de embalagem", "Saco a vácuo", "Organizador de geladeira", "Dispenser de arroz"],
  "Organizador magnético": ["Suporte para temperos", "Gancho adesivo", "Caixa modular cozinha"],
};

export const filaStatuses = [
  "aguardando produto", "produto em análise", "aguardando aprovação do produto",
  "roteiro em produção", "roteiro aguardando aprovação",
  "fotos em produção", "fotos aguardando aprovação",
  "vídeos em geração", "carrosséis em geração", "edição automática",
  "revisão interna", "aprovado", "entregue", "publicado",
  "aguardando métricas", "analisado", "erro", "aguardando conta Gemini disponível",
];

export const automacoes = [
  { trigger: "Produto aprovado", acao: "Permitir criar campanha", ativo: true },
  { trigger: "Campanha aprovada", acao: "Gerar roteiros", ativo: true },
  { trigger: "Roteiro aprovado", acao: "Gerar fotos base", ativo: true },
  { trigger: "Fotos aprovadas", acao: "Gerar vídeos ou carrosséis", ativo: true },
  { trigger: "Criativo aprovado", acao: "Salvar em Criativos Finais", ativo: true },
  { trigger: "Criativo publicado", acao: "Iniciar acompanhamento via API", ativo: true },
  { trigger: "Métricas importadas", acao: "Recalcular scores", ativo: true },
  { trigger: "Criativo campeão", acao: "Sugerir variações", ativo: true },
  { trigger: "Clique sem venda", acao: "Sugerir revisar oferta/produto", ativo: true },
  { trigger: "Formato falhou 3x", acao: "Marcar como evitar", ativo: true },
  { trigger: "Avatar performa bem em nicho", acao: "Recomendar para futuras campanhas", ativo: true },
  { trigger: "Vídeo caro vendendo bem", acao: "Sugerir versão carrossel", ativo: true },
  { trigger: "Carrossel vendendo bem", acao: "Sugerir versão vídeo", ativo: true },
  { trigger: "Produto saturando", acao: "Sugerir produto irmão", ativo: true },
];

export const recomendacoesAcoes = {
  perfil: ["Analisar este perfil", "Gerar plano da semana", "O que repetir?", "O que evitar?", "Quais produtos escalar?", "Quais formatos priorizar?"],
  campanha: ["Analisar campanha", "Gerar variações dos vencedores", "Identificar problema de conversão", "Comparar formatos"],
  produto: ["Analisar produto", "Criar novos ângulos", "Comparar com produtos parecidos", "Decidir escalar ou pausar"],
  cliente: ["Analisar entregas do cliente", "Gerar recomendação para próximo mês", "Montar relatório para cliente"],
};
