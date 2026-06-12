// Extended mock data: formatos, ângulos, diagnóstico, conectores, carrosséis.

export type RecomendacaoNivel = "Alta" | "Média" | "Baixa" | "Evitar";

export type FormatoVideo = {
  id: string;
  nome: string;
  descricao: string;
  quandoUsar: string;
  custoMedio: number;
  conversaoHistorica: number; // %
  vendasPorCriativo: number;
  roi: number;
  recomendacao: RecomendacaoNivel;
};

export const formatosVideo: FormatoVideo[] = [
  { id: "teste-real", nome: "Teste real", descricao: "Usuário testando ao vivo.", quandoUsar: "Produto precisa de prova.", custoMedio: 18, conversaoHistorica: 3.2, vendasPorCriativo: 41, roi: 22.4, recomendacao: "Alta" },
  { id: "problema-solucao", nome: "Problema/solução", descricao: "Mostra dor e depois alivia com produto.", quandoUsar: "Produto resolve dor clara.", custoMedio: 16, conversaoHistorica: 3.5, vendasPorCriativo: 48, roi: 24.1, recomendacao: "Alta" },
  { id: "antes-depois", nome: "Antes/depois", descricao: "Transformação visual rápida.", quandoUsar: "Beleza, organização, limpeza.", custoMedio: 17, conversaoHistorica: 3.8, vendasPorCriativo: 56, roi: 28.0, recomendacao: "Alta" },
  { id: "review-honesta", nome: "Review honesta", descricao: "Opinião pessoal direta.", quandoUsar: "Produto com bom review real.", custoMedio: 15, conversaoHistorica: 2.6, vendasPorCriativo: 28, roi: 14.2, recomendacao: "Média" },
  { id: "produto-viral", nome: "Produto viral", descricao: "Reação ao produto da moda.", quandoUsar: "Quando há onda de buscas.", custoMedio: 14, conversaoHistorica: 1.8, vendasPorCriativo: 22, roi: 9.4, recomendacao: "Média" },
  { id: "achei-inutil", nome: "Eu achei que era inútil", descricao: "Quebra objeção inicial.", quandoUsar: "Produto que parece gimmick.", custoMedio: 15, conversaoHistorica: 3.1, vendasPorCriativo: 38, roi: 18.8, recomendacao: "Alta" },
  { id: "nao-compre", nome: "Não compre antes de ver", descricao: "Gancho de curiosidade.", quandoUsar: "Pode virar view bait — cuidado.", custoMedio: 14, conversaoHistorica: 1.2, vendasPorCriativo: 12, roi: 4.1, recomendacao: "Baixa" },
  { id: "3-motivos", nome: "3 motivos para comprar", descricao: "Lista visual rápida.", quandoUsar: "Produto com benefícios claros.", custoMedio: 13, conversaoHistorica: 2.8, vendasPorCriativo: 32, roi: 15.6, recomendacao: "Média" },
  { id: "comparacao-antigo", nome: "Comparação com método antigo", descricao: "Antes vs agora.", quandoUsar: "Substitui hábito ineficiente.", custoMedio: 16, conversaoHistorica: 3.0, vendasPorCriativo: 34, roi: 16.9, recomendacao: "Alta" },
  { id: "unboxing", nome: "Unboxing rápido", descricao: "Abre e mostra em 9s.", quandoUsar: "Embalagem é parte do encanto.", custoMedio: 12, conversaoHistorica: 1.6, vendasPorCriativo: 18, roi: 6.8, recomendacao: "Baixa" },
  { id: "demo-silenciosa", nome: "Demonstração silenciosa", descricao: "Sem voz, só texto e ação.", quandoUsar: "Produto autoexplicativo.", custoMedio: 11, conversaoHistorica: 2.4, vendasPorCriativo: 24, roi: 12.2, recomendacao: "Média" },
  { id: "reacao-surpresa", nome: "Reação surpresa", descricao: "Expressão genuína.", quandoUsar: "Resultado é inesperado.", custoMedio: 14, conversaoHistorica: 2.2, vendasPorCriativo: 22, roi: 9.9, recomendacao: "Média" },
  { id: "erro-comum", nome: "Erro comum", descricao: "Mostra o que todo mundo faz errado.", quandoUsar: "Educa e vende solução.", custoMedio: 15, conversaoHistorica: 2.9, vendasPorCriativo: 30, roi: 14.6, recomendacao: "Alta" },
  { id: "coisa-barata", nome: "Coisa barata que resolve", descricao: "Preço como gancho.", quandoUsar: "Ticket baixo.", custoMedio: 12, conversaoHistorica: 2.6, vendasPorCriativo: 28, roi: 13.4, recomendacao: "Alta" },
  { id: "queria-ter-comprado", nome: "Produto que eu queria ter comprado antes", descricao: "Tom de arrependimento positivo.", quandoUsar: "Resolve dor antiga.", custoMedio: 13, conversaoHistorica: 2.7, vendasPorCriativo: 28, roi: 13.1, recomendacao: "Média" },
  { id: "evita-problema", nome: "Isso evita um problema chato", descricao: "Foco em prevenção.", quandoUsar: "Produto preventivo.", custoMedio: 13, conversaoHistorica: 2.5, vendasPorCriativo: 26, roi: 12.3, recomendacao: "Média" },
  { id: "sera-funciona", nome: "Será que funciona mesmo?", descricao: "Suspense + reveal.", quandoUsar: "Boa para reviews.", custoMedio: 14, conversaoHistorica: 1.9, vendasPorCriativo: 20, roi: 8.8, recomendacao: "Média" },
  { id: "testando-famoso", nome: "Testando produto famoso", descricao: "Surfa em produto popular.", quandoUsar: "Onda de tendência.", custoMedio: 13, conversaoHistorica: 1.5, vendasPorCriativo: 14, roi: 5.6, recomendacao: "Baixa" },
  { id: "presente-util", nome: "Presente útil", descricao: "Posiciona como presente.", quandoUsar: "Datas comemorativas.", custoMedio: 14, conversaoHistorica: 2.3, vendasPorCriativo: 22, roi: 10.4, recomendacao: "Média" },
  { id: "organizacao-satisfatoria", nome: "Organização/transformação satisfatória", descricao: "Vídeo ASMR de transformação.", quandoUsar: "Casa, organização, beleza.", custoMedio: 17, conversaoHistorica: 3.4, vendasPorCriativo: 44, roi: 21.0, recomendacao: "Alta" },
];

export type FormatoCarrossel = FormatoVideo & { slidesPadrao: number };

export const formatosCarrossel: FormatoCarrossel[] = [
  { id: "problema-solucao-c", nome: "Problema → Solução", descricao: "2 slides de dor, 4 de solução.", quandoUsar: "Dor clara.", custoMedio: 9, conversaoHistorica: 4.1, vendasPorCriativo: 58, roi: 30.2, recomendacao: "Alta", slidesPadrao: 6 },
  { id: "antes-depois-c", nome: "Antes/depois", descricao: "Slides comparativos.", quandoUsar: "Transformação visível.", custoMedio: 8, conversaoHistorica: 4.4, vendasPorCriativo: 62, roi: 32.6, recomendacao: "Alta", slidesPadrao: 6 },
  { id: "3-motivos-c", nome: "3 motivos para comprar", descricao: "1 slide por motivo.", quandoUsar: "Benefícios claros.", custoMedio: 7, conversaoHistorica: 3.4, vendasPorCriativo: 41, roi: 22.1, recomendacao: "Alta", slidesPadrao: 5 },
  { id: "review-slides", nome: "Review em slides", descricao: "Print de reviews reais.", quandoUsar: "Prova social forte.", custoMedio: 6, conversaoHistorica: 3.0, vendasPorCriativo: 34, roi: 18.9, recomendacao: "Alta", slidesPadrao: 5 },
  { id: "erros-resolve", nome: "Erros que esse produto resolve", descricao: "Lista de erros + alívio.", quandoUsar: "Educacional.", custoMedio: 7, conversaoHistorica: 3.1, vendasPorCriativo: 36, roi: 19.4, recomendacao: "Média", slidesPadrao: 6 },
  { id: "barato-evita-dor", nome: "Produto barato que evita dor de cabeça", descricao: "Preço + alívio.", quandoUsar: "Ticket baixo.", custoMedio: 6, conversaoHistorica: 3.3, vendasPorCriativo: 38, roi: 20.4, recomendacao: "Alta", slidesPadrao: 5 },
  { id: "checklist-visual", nome: "Checklist visual", descricao: "Cada slide marca um item.", quandoUsar: "Decisão racional.", custoMedio: 6, conversaoHistorica: 2.6, vendasPorCriativo: 28, roi: 14.2, recomendacao: "Média", slidesPadrao: 6 },
  { id: "comparacao-metodo", nome: "Comparação método antigo vs produto", descricao: "Lado a lado.", quandoUsar: "Substitui hábito.", custoMedio: 7, conversaoHistorica: 3.0, vendasPorCriativo: 34, roi: 18.0, recomendacao: "Alta", slidesPadrao: 6 },
  { id: "guia-rapido", nome: "Guia rápido de uso", descricao: "Passo a passo curto.", quandoUsar: "Produto com curva mínima.", custoMedio: 7, conversaoHistorica: 2.4, vendasPorCriativo: 24, roi: 12.0, recomendacao: "Média", slidesPadrao: 6 },
  { id: "para-quem-tem", nome: "Produto para quem tem esse problema", descricao: "Segmenta o leitor.", quandoUsar: "Público específico.", custoMedio: 6, conversaoHistorica: 2.8, vendasPorCriativo: 30, roi: 15.6, recomendacao: "Média", slidesPadrao: 5 },
  { id: "compraria-por-isso", nome: "Eu compraria por isso", descricao: "POV pessoal.", quandoUsar: "Constrói desejo.", custoMedio: 6, conversaoHistorica: 2.6, vendasPorCriativo: 26, roi: 13.4, recomendacao: "Média", slidesPadrao: 5 },
  { id: "prova-visual", nome: "Prova visual em sequência", descricao: "Fotos reais em sequência.", quandoUsar: "Resultado visível.", custoMedio: 8, conversaoHistorica: 3.7, vendasPorCriativo: 46, roi: 23.8, recomendacao: "Alta", slidesPadrao: 6 },
  { id: "beneficios-5", nome: "Benefícios em 5 slides", descricao: "1 benefício por slide.", quandoUsar: "Produto com muitos benefícios.", custoMedio: 7, conversaoHistorica: 3.0, vendasPorCriativo: 32, roi: 16.1, recomendacao: "Média", slidesPadrao: 5 },
  { id: "mitos-verdades", nome: "Mitos e verdades", descricao: "Quebra objeções.", quandoUsar: "Categoria com mitos.", custoMedio: 7, conversaoHistorica: 2.8, vendasPorCriativo: 30, roi: 15.0, recomendacao: "Média", slidesPadrao: 6 },
  { id: "mini-tutorial", nome: "Mini tutorial", descricao: "Como fazer em 4 passos.", quandoUsar: "Educacional rápido.", custoMedio: 7, conversaoHistorica: 2.5, vendasPorCriativo: 26, roi: 12.8, recomendacao: "Média", slidesPadrao: 5 },
  { id: "o-que-vem", nome: "O que vem no produto", descricao: "Conteúdo do kit.", quandoUsar: "Produto com vários itens.", custoMedio: 6, conversaoHistorica: 2.2, vendasPorCriativo: 22, roi: 10.4, recomendacao: "Baixa", slidesPadrao: 5 },
  { id: "rotina-real", nome: "Produto em rotina real", descricao: "Fotos de uso no dia a dia.", quandoUsar: "Lifestyle.", custoMedio: 7, conversaoHistorica: 2.6, vendasPorCriativo: 28, roi: 14.0, recomendacao: "Média", slidesPadrao: 6 },
  { id: "top-5-situacoes", nome: "Top 5 situações para usar", descricao: "Cenários de uso.", quandoUsar: "Produto versátil.", custoMedio: 7, conversaoHistorica: 2.7, vendasPorCriativo: 30, roi: 15.0, recomendacao: "Média", slidesPadrao: 5 },
  { id: "antes-comprar-veja", nome: "Antes de comprar, veja isso", descricao: "Honestidade + benefício.", quandoUsar: "Reduz devolução.", custoMedio: 6, conversaoHistorica: 2.5, vendasPorCriativo: 26, roi: 13.0, recomendacao: "Média", slidesPadrao: 5 },
  { id: "transformacao-satisfatoria-c", nome: "Transformação satisfatória", descricao: "Antes/durante/depois.", quandoUsar: "Casa, beleza, organização.", custoMedio: 8, conversaoHistorica: 4.2, vendasPorCriativo: 58, roi: 30.0, recomendacao: "Alta", slidesPadrao: 6 },
];

export const angulosVendedores: { id: string; nome: string; descricao: string }[] = [
  { id: "economiza-tempo", nome: "Economiza tempo", descricao: "Faz em segundos o que levava minutos." },
  { id: "evita-desperdicio", nome: "Evita desperdício", descricao: "Salva comida, dinheiro, esforço." },
  { id: "resolve-vergonha", nome: "Resolve vergonha", descricao: "Aborda situações constrangedoras." },
  { id: "deixa-mais-bonito", nome: "Deixa mais bonito", descricao: "Resultado estético claro." },
  { id: "evita-bagunca", nome: "Evita bagunça", descricao: "Organiza, esconde, alinha." },
  { id: "ajuda-rotina", nome: "Ajuda na rotina", descricao: "Cabe no dia a dia." },
  { id: "parece-caro-barato", nome: "Parece caro, mas é barato", descricao: "Percepção de valor alta." },
  { id: "presente-util", nome: "Presente útil", descricao: "Bom para presentear." },
  { id: "antes-errado", nome: "Antes eu fazia errado", descricao: "Vergonha leve + alívio." },
  { id: "evita-dor-cabeca", nome: "Produto que evita dor de cabeça", descricao: "Foca em prevenção." },
  { id: "resolve-invisivel", nome: "Resolve problema invisível", descricao: "Mostra um problema que você nem via." },
  { id: "parece-bobo-funciona", nome: "Parece bobo, mas funciona", descricao: "Quebra ceticismo." },
];

export type CasoDiagnostico = {
  id: string;
  titulo: string;
  diagnostico: string;
  acao: string;
  status: "Escalar" | "Corrigir CTA" | "Corrigir gancho" | "Trocar produto" | "Trocar oferta" | "Trocar avatar" | "Trocar formato" | "Pausar";
  exemploCriativo: string;
  views: number;
  cliques: number;
  vendas: number;
};

export const casosDiagnostico: CasoDiagnostico[] = [
  { id: "c1", titulo: "Muita view + pouco clique", diagnostico: "Chamou atenção mas não gerou desejo de compra.", acao: "Melhorar CTA, mostrar produto antes, deixar benefício claro, trocar gancho de curiosidade por gancho de dor.", status: "Corrigir CTA", exemploCriativo: "Pet dançando viral", views: 420000, cliques: 1800, vendas: 22 },
  { id: "c2", titulo: "Muito clique + pouca venda", diagnostico: "Gerou intenção, mas oferta/produto não converteu.", acao: "Testar outro vendedor, revisar preço, frete, reviews, promessa, página do produto.", status: "Trocar oferta", exemploCriativo: "Mini seladora R$49", views: 88000, cliques: 6200, vendas: 24 },
  { id: "c3", titulo: "Pouca view + boa conversão", diagnostico: "Produto vende, mas criativo não alcança gente suficiente.", acao: "Manter produto e criar novos ganchos, capas e formatos mais visuais.", status: "Trocar gancho", exemploCriativo: "Organizador silencioso", views: 24000, cliques: 1900, vendas: 86 },
  { id: "c4", titulo: "Muita view + muita venda", diagnostico: "Criativo campeão.", acao: "Criar variações com mesmo avatar, formato e gancho em produtos parecidos.", status: "Escalar", exemploCriativo: "Pele em 7 dias", views: 412000, cliques: 14200, vendas: 520 },
  { id: "c5", titulo: "Pouca view + pouco clique + pouca venda", diagnostico: "Criativo fraco ou produto sem apelo.", acao: "Pausar ou testar no máximo poucas variações.", status: "Pausar", exemploCriativo: "Brinquedo dançante", views: 9200, cliques: 80, vendas: 1 },
];

export type Conector = {
  id: string;
  nome: string;
  tipo: "vendas" | "criativos" | "anúncios" | "analytics";
  status: "conectado" | "pendente" | "erro" | "desconectado";
  ultimaSync: string;
  metricas: string[];
};

export const conectores: Conector[] = [
  { id: "shop-partner", nome: "TikTok Shop Partner API", tipo: "vendas", status: "conectado", ultimaSync: "há 12 min", metricas: ["pedidos", "vendas", "comissão", "produto vendido", "status do pedido"] },
  { id: "shop-affiliate", nome: "TikTok Shop Affiliate API", tipo: "vendas", status: "conectado", ultimaSync: "há 24 min", metricas: ["comissão", "criativo associado", "receita"] },
  { id: "developer", nome: "TikTok Developer API", tipo: "criativos", status: "conectado", ultimaSync: "há 6 min", metricas: ["vídeos publicados", "carrosséis publicados", "views", "curtidas", "comentários", "compartilhamentos", "salvamentos"] },
  { id: "business", nome: "TikTok Business API", tipo: "anúncios", status: "pendente", ultimaSync: "—", metricas: ["impressões pagas", "custo", "ROAS"] },
  { id: "analytics", nome: "TikTok Analytics", tipo: "analytics", status: "erro", ultimaSync: "há 3h", metricas: ["audiência", "horários de pico"] },
];

export type CampanhaFull = {
  id: string;
  nome: string;
  tipo: "uso próprio" | "cliente";
  perfilOuCliente: string;
  produto: string;
  avatar: string;
  objetivo: string;
  pais: string;
  nicho: string;
  status: "rascunho" | "em produção" | "em revisão" | "publicada" | "encerrada";
  caminho: "vídeos" | "carrosséis" | "mista";
  mixSugerido: { videos: number; carrosseis: number }; // %
  formatosVideo: { id: string; quantidade: number }[];
  formatosCarrossel: { id: string; quantidade: number }[];
  custoEstimado: number;
  custoReal: number;
  receita: number;
  lucroEstimado: number;
  roi: number;
  roteiros: number;
  fotos: number;
  videosGerados: number;
  carrosseisGerados: number;
  criativosFinais: number;
  entregas: number;
  inicio: string;
};

export const campanhasFull: CampanhaFull[] = [
  {
    id: "c1", nome: "Organizador magnético — Junho", tipo: "uso próprio",
    perfilOuCliente: "Casa Inteligente", produto: "Organizador magnético",
    avatar: "Marina BR", objetivo: "Escalar vendas", pais: "BR", nicho: "Smart Home",
    status: "publicada", caminho: "carrosséis", mixSugerido: { videos: 30, carrosseis: 70 },
    formatosVideo: [{ id: "antes-depois", quantidade: 2 }],
    formatosCarrossel: [{ id: "antes-depois-c", quantidade: 4 }, { id: "prova-visual", quantidade: 2 }],
    custoEstimado: 140, custoReal: 145, receita: 12340, lucroEstimado: 12195, roi: 84.1,
    roteiros: 8, fotos: 42, videosGerados: 2, carrosseisGerados: 6, criativosFinais: 8, entregas: 8,
    inicio: "2026-06-01",
  },
  {
    id: "c2", nome: "Sérum VitC — Onda 2", tipo: "uso próprio",
    perfilOuCliente: "Beleza Viral", produto: "Sérum Vitamina C 20%",
    avatar: "Aya JP", objetivo: "Validar gancho novo", pais: "BR", nicho: "Skincare",
    status: "publicada", caminho: "vídeos", mixSugerido: { videos: 80, carrosseis: 20 },
    formatosVideo: [{ id: "antes-depois", quantidade: 6 }, { id: "problema-solucao", quantidade: 3 }],
    formatosCarrossel: [{ id: "review-slides", quantidade: 3 }],
    custoEstimado: 210, custoReal: 220, receita: 31200, lucroEstimado: 30980, roi: 140.8,
    roteiros: 12, fotos: 28, videosGerados: 9, carrosseisGerados: 3, criativosFinais: 12, entregas: 10,
    inicio: "2026-06-03",
  },
  {
    id: "c3", nome: "Mini seladora — Teste", tipo: "uso próprio",
    perfilOuCliente: "Casa Inteligente", produto: "Mini seladora portátil",
    avatar: "Marina BR", objetivo: "Validar formato vencedor", pais: "BR", nicho: "Cozinha",
    status: "em produção", caminho: "mista", mixSugerido: { videos: 50, carrosseis: 50 },
    formatosVideo: [{ id: "demo-silenciosa", quantidade: 2 }],
    formatosCarrossel: [{ id: "antes-depois-c", quantidade: 2 }, { id: "problema-solucao-c", quantidade: 1 }],
    custoEstimado: 95, custoReal: 90, receita: 0, lucroEstimado: 0, roi: 0,
    roteiros: 5, fotos: 18, videosGerados: 1, carrosseisGerados: 2, criativosFinais: 3, entregas: 0,
    inicio: "2026-06-09",
  },
  {
    id: "c4", nome: "Pet Prime — Escova", tipo: "cliente",
    perfilOuCliente: "Pet Prime", produto: "Escova removedora de pelos",
    avatar: "Tom BR", objetivo: "Entrega contratual", pais: "BR", nicho: "Pets",
    status: "em revisão", caminho: "mista", mixSugerido: { videos: 60, carrosseis: 40 },
    formatosVideo: [{ id: "teste-real", quantidade: 3 }, { id: "antes-depois", quantidade: 1 }],
    formatosCarrossel: [{ id: "antes-depois-c", quantidade: 2 }],
    custoEstimado: 120, custoReal: 110, receita: 0, lucroEstimado: 0, roi: 0,
    roteiros: 6, fotos: 22, videosGerados: 4, carrosseisGerados: 2, criativosFinais: 6, entregas: 0,
    inicio: "2026-06-08",
  },
];

export type Carrossel = {
  id: string;
  titulo: string;
  campanha: string;
  produto: string;
  avatar: string;
  formato: string;
  angulo: string;
  slides: { texto: string; legenda: string }[];
  cta: string;
  status: "em produção" | "aprovação" | "aprovado" | "publicado" | "rejeitado";
  custo: number;
  views?: number; cliques?: number; vendas?: number;
};

export const carrosseis: Carrossel[] = [
  {
    id: "cx1", titulo: "Bancada bagunçada virou organizada",
    campanha: "Organizador magnético — Junho", produto: "Organizador magnético",
    avatar: "Marina BR", formato: "Antes/depois", angulo: "Evita bagunça",
    slides: [
      { texto: "Sua bancada vive assim?", legenda: "gancho" },
      { texto: "O problema é não ter onde colocar os utensílios", legenda: "problema" },
      { texto: "Esse organizador magnético resolve", legenda: "produto" },
      { texto: "Cola na geladeira ou parede", legenda: "demonstração" },
      { texto: "Resultado: tudo à mão e visível", legenda: "resultado" },
      { texto: "Clica no carrinho amarelo 🛒", legenda: "CTA" },
    ],
    cta: "Clica no carrinho amarelo",
    status: "publicado", custo: 8, views: 64000, cliques: 1820, vendas: 71,
  },
  {
    id: "cx2", titulo: "3 erros que estragam a comida aberta",
    campanha: "Mini seladora — Teste", produto: "Mini seladora portátil",
    avatar: "Marina BR", formato: "Erros que esse produto resolve", angulo: "Evita desperdício",
    slides: [
      { texto: "Você joga comida fora toda semana?", legenda: "gancho" },
      { texto: "Erro 1: deixar saco aberto torcido", legenda: "erro1" },
      { texto: "Erro 2: presilha que solta", legenda: "erro2" },
      { texto: "Erro 3: pote do tamanho errado", legenda: "erro3" },
      { texto: "Solução: mini seladora portátil", legenda: "produto" },
      { texto: "Sela qualquer embalagem em 2s 🛒", legenda: "CTA" },
    ],
    cta: "Sela qualquer embalagem em 2s",
    status: "aprovação", custo: 7,
  },
];

// ---------- Lógica de recomendação caminho ----------
export function recomendarCaminho(p: {
  facilidadeVisual: number; antesDepois: number; clarezaDor: number;
  potencialVideo: number; potencialCarrossel: number;
}) {
  const carrossel = (p.antesDepois * 0.35 + p.clarezaDor * 0.25 + p.potencialCarrossel * 0.4);
  const video = (p.facilidadeVisual * 0.35 + p.potencialVideo * 0.5 + p.clarezaDor * 0.15);
  const total = carrossel + video;
  const pctC = Math.round((carrossel / total) * 100);
  const pctV = 100 - pctC;
  const principal = pctC >= pctV ? "carrossel" : "vídeo";
  const justificativas: string[] = [];
  if (p.antesDepois >= 85) justificativas.push("antes/depois funciona muito bem em imagem");
  if (p.facilidadeVisual >= 90 && p.potencialVideo >= 90) justificativas.push("produto precisa de movimento real");
  if (p.clarezaDor >= 85) justificativas.push("o carrossel consegue explicar bem a dor");
  if (p.potencialCarrossel >= 90) justificativas.push("histórico mostra carrossel barato convertendo");
  return { pctCarrossel: pctC, pctVideo: pctV, principal, justificativas };
}

export function eficienciaComercial(f: { vendasPorCriativo: number; conversaoHistorica: number; roi: number; custoMedio: number }) {
  // peso: ROI 40%, vendas/criativo 25%, conversão 20%, custo inverso 15%
  const custoScore = Math.max(0, 100 - f.custoMedio * 4);
  return Math.round(f.roi * 1.2 + f.vendasPorCriativo * 0.6 + f.conversaoHistorica * 6 + custoScore * 0.15);
}
