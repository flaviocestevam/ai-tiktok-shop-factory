// Rich mock data for AI TikTok Shop Video Factory (internal tool)

export type Period = "today" | "7d" | "month" | "lifetime";

export type Perfil = {
  id: string;
  nome: string;
  nicho: string;
  pais: string;
  plataforma: string;
  status: "ativo" | "pausado" | "teste";
  descricao: string;
  avatarPrincipal: string;
  produtosAtivos: number;
  campanhasVinculadas: number;
  criadoEm: string;
  observacoes: string;
  metricas: {
    views: number;
    videos: number;
    carrosseis: number;
    criativos: number;
    cliques: number;
    vendas: number;
    receita: number;
    custoProducao: number;
    lucro: number;
    roi: number;
    ctr: number;
    cvr: number;
    vendasPor1k: number;
    receitaPor1k: number;
    custoPorVenda: number;
    custoPorCriativo: number;
    melhorProduto: string;
    piorProduto: string;
    melhorFormato: string;
    piorFormato: string;
    melhorAvatar: string;
    melhorGancho: string;
    melhorTipo: "vídeo" | "carrossel";
  };
  recomendacoes: { repetir: string[]; evitar: string[] };
};

export const perfis: Perfil[] = [
  {
    id: "casa-inteligente",
    nome: "Casa Inteligente",
    nicho: "Smart Home",
    pais: "Brasil",
    plataforma: "TikTok Shop BR",
    status: "ativo",
    descricao: "Perfil focado em gadgets úteis para casa, organização e automação.",
    avatarPrincipal: "Marina BR",
    produtosAtivos: 14,
    campanhasVinculadas: 8,
    criadoEm: "2025-02-12",
    observacoes: "Carrosséis de antes/depois estão escalando bem.",
    metricas: {
      views: 1842300, videos: 42, carrosseis: 58, criativos: 100,
      cliques: 41200, vendas: 1280, receita: 38420, custoProducao: 1820, lucro: 36600,
      roi: 20.1, ctr: 2.24, cvr: 3.1, vendasPor1k: 0.69, receitaPor1k: 20.85,
      custoPorVenda: 1.42, custoPorCriativo: 18.2,
      melhorProduto: "Organizador magnético", piorProduto: "Luminária dobrável",
      melhorFormato: "Carrossel 7 imagens", piorFormato: "Vídeo 45s",
      melhorAvatar: "Marina BR", melhorGancho: "“Eu não sabia que precisava disso”",
      melhorTipo: "carrossel",
    },
    recomendacoes: {
      repetir: ["Carrosséis com antes/depois", "Ganchos de descoberta", "Avatar Marina BR em cenário cozinha"],
      evitar: ["Vídeos longos sem demonstração nos primeiros 2s", "Produtos sem dor clara"],
    },
  },
  {
    id: "beleza-viral",
    nome: "Beleza Viral",
    nicho: "Beauty",
    pais: "Brasil",
    plataforma: "TikTok Shop BR",
    status: "ativo",
    descricao: "Skincare e maquiagem com foco em resultado visível.",
    avatarPrincipal: "Aya JP",
    produtosAtivos: 21,
    campanhasVinculadas: 11,
    criadoEm: "2025-01-05",
    observacoes: "Vídeos curtos com transformação 0-15s convertem 2x mais.",
    metricas: {
      views: 3120800, videos: 88, carrosseis: 34, criativos: 122,
      cliques: 78900, vendas: 2640, receita: 84210, custoProducao: 2410, lucro: 81800,
      roi: 33.9, ctr: 2.53, cvr: 3.34, vendasPor1k: 0.84, receitaPor1k: 26.98,
      custoPorVenda: 0.91, custoPorCriativo: 19.8,
      melhorProduto: "Sérum vitamina C", piorProduto: "Pincel duo",
      melhorFormato: "Vídeo 12s transformação", piorFormato: "Carrossel 10 imagens",
      melhorAvatar: "Aya JP", melhorGancho: "“Em 7 dias minha pele mudou”",
      melhorTipo: "vídeo",
    },
    recomendacoes: {
      repetir: ["Transformação visível nos primeiros 3s", "Sérum vitamina C em variações"],
      evitar: ["Carrosséis com mais de 8 imagens", "Pincéis e acessórios sem dor clara"],
    },
  },
  {
    id: "pet-achadinhos",
    nome: "Pet Achadinhos",
    nicho: "Pets",
    pais: "Brasil",
    plataforma: "TikTok Shop BR",
    status: "teste",
    descricao: "Produtos curiosos e úteis para tutores de cães e gatos.",
    avatarPrincipal: "Tom BR",
    produtosAtivos: 9,
    campanhasVinculadas: 4,
    criadoEm: "2025-04-22",
    observacoes: "Alto risco de view bait. Validar venda por 1k antes de escalar.",
    metricas: {
      views: 980400, videos: 36, carrosseis: 12, criativos: 48,
      cliques: 12400, vendas: 410, receita: 9820, custoProducao: 920, lucro: 8900,
      roi: 9.7, ctr: 1.26, cvr: 3.3, vendasPor1k: 0.42, receitaPor1k: 10.02,
      custoPorVenda: 2.24, custoPorCriativo: 19.2,
      melhorProduto: "Escova removedora", piorProduto: "Brinquedo engraçado",
      melhorFormato: "Vídeo 15s com pet", piorFormato: "Carrossel didático",
      melhorAvatar: "Tom BR", melhorGancho: "“Meu cachorro parou de soltar pelo”",
      melhorTipo: "vídeo",
    },
    recomendacoes: {
      repetir: ["Demonstrações reais com o pet", "Ganchos de problema resolvido"],
      evitar: ["Produtos curiosos sem utilidade real", "Vídeos só engraçados"],
    },
  },
];

export type Cliente = {
  id: string;
  nome: string;
  empresa: string;
  whatsapp: string;
  email: string;
  pais: string;
  nicho: string;
  plano: string;
  valor: number;
  videosContratados: number;
  carrosseisContratados: number;
  status: "em dia" | "atrasado" | "pendente";
  produtosAtivos: number;
  campanhas: number;
  criativosProduzidos: number;
  criativosEntregues: number;
  custoProducao: number;
  observacoes: string;
};

export const clientes: Cliente[] = [
  {
    id: "loja-x", nome: "Patrícia Lima", empresa: "Loja X", whatsapp: "+55 11 99999-1111",
    email: "patricia@lojax.com", pais: "Brasil", nicho: "Casa & utilidades",
    plano: "Pro Mensal", valor: 1997,
    videosContratados: 20, carrosseisContratados: 10,
    status: "em dia", produtosAtivos: 6, campanhas: 3,
    criativosProduzidos: 30, criativosEntregues: 30, custoProducao: 410,
    observacoes: "Cliente recorrente há 4 meses. Prefere ganchos calmos.",
  },
  {
    id: "skin-bloom", nome: "Rafael Souza", empresa: "Skin Bloom", whatsapp: "+55 21 98888-2222",
    email: "rafa@skinbloom.com", pais: "Brasil", nicho: "Skincare",
    plano: "Starter Mensal", valor: 1297,
    videosContratados: 12, carrosseisContratados: 6,
    status: "em dia", produtosAtivos: 4, campanhas: 2,
    criativosProduzidos: 14, criativosEntregues: 12, custoProducao: 290,
    observacoes: "Quer testar 2 avatares novos no próximo ciclo.",
  },
  {
    id: "pet-prime", nome: "Carla Mendes", empresa: "Pet Prime", whatsapp: "+55 31 97777-3333",
    email: "carla@petprime.com", pais: "Brasil", nicho: "Pets",
    plano: "Pro Mensal", valor: 1997,
    videosContratados: 18, carrosseisContratados: 12,
    status: "pendente", produtosAtivos: 5, campanhas: 3,
    criativosProduzidos: 22, criativosEntregues: 18, custoProducao: 380,
    observacoes: "Aguardando aprovação de 4 criativos.",
  },
];

export type Produto = {
  id: string; nome: string; imagem: string; pais: string; plataforma: string;
  categoria: string; nicho: string; preco: number; comissao: number; ticketMedio: number;
  beneficio: string; dor: string; publico: string;
  avaliacao: number; reviews: number; reclamacoes: string[];
  estoque: number; entregaDias: number; devolucao: number;
  concorrencia: "baixa" | "média" | "alta"; saturacao: "baixa" | "média" | "alta";
  facilidadeVisual: number; antesDepois: number; clarezaDor: number; impulso: number;
  risco: "baixo" | "médio" | "alto";
  potencialVideo: number; potencialCarrossel: number;
  score: number;
  status: "em análise" | "aprovado" | "rejeitado" | "em teste" | "vencedor" | "pausado" | "evitar";
  classificacao: "view bait" | "conversão silenciosa" | "neutro";
  objecoes: string[];
};

export const produtos: Produto[] = [
  {
    id: "organizador-magnetico", nome: "Organizador magnético para cozinha",
    imagem: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70",
    pais: "BR", plataforma: "TikTok Shop", categoria: "Casa", nicho: "Smart Home",
    preco: 79.9, comissao: 25, ticketMedio: 82,
    beneficio: "Libera bancada e mantém utensílios à mão",
    dor: "Bancada bagunçada e sem espaço", publico: "Mulheres 25-45, donas de casa",
    avaliacao: 4.7, reviews: 1284, reclamacoes: ["Imã podia ser mais forte"],
    estoque: 320, entregaDias: 6, devolucao: 2.1,
    concorrencia: "média", saturacao: "média",
    facilidadeVisual: 92, antesDepois: 94, clarezaDor: 88, impulso: 82,
    risco: "baixo", potencialVideo: 78, potencialCarrossel: 96,
    score: 91, status: "vencedor", classificacao: "conversão silenciosa",
    objecoes: ["Será que o ímã segura mesmo?", "Risca a parede?", "Cabe faca grande?"],
  },
  {
    id: "serum-vitc", nome: "Sérum Vitamina C 20%",
    imagem: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=70",
    pais: "BR", plataforma: "TikTok Shop", categoria: "Beleza", nicho: "Skincare",
    preco: 89, comissao: 30, ticketMedio: 95,
    beneficio: "Pele mais uniforme em 7 dias",
    dor: "Manchas e textura irregular", publico: "Mulheres 22-40",
    avaliacao: 4.8, reviews: 3210, reclamacoes: ["Cheiro forte"],
    estoque: 980, entregaDias: 5, devolucao: 1.4,
    concorrencia: "alta", saturacao: "alta",
    facilidadeVisual: 88, antesDepois: 96, clarezaDor: 94, impulso: 90,
    risco: "baixo", potencialVideo: 95, potencialCarrossel: 82,
    score: 94, status: "vencedor", classificacao: "conversão silenciosa",
    objecoes: ["Funciona em pele oleosa?", "Pode usar de dia?", "Demora pra ver resultado?"],
  },
  {
    id: "mini-seladora", nome: "Mini seladora portátil",
    imagem: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600&q=70",
    pais: "BR", plataforma: "TikTok Shop", categoria: "Casa", nicho: "Cozinha",
    preco: 49.9, comissao: 22, ticketMedio: 52,
    beneficio: "Sela qualquer embalagem em 2 segundos",
    dor: "Comida estragando depois de aberta", publico: "Famílias 25-55",
    avaliacao: 4.5, reviews: 920, reclamacoes: ["Pilha acaba rápido"],
    estoque: 540, entregaDias: 7, devolucao: 3.2,
    concorrencia: "média", saturacao: "média",
    facilidadeVisual: 90, antesDepois: 84, clarezaDor: 86, impulso: 88,
    risco: "baixo", potencialVideo: 90, potencialCarrossel: 88,
    score: 87, status: "em teste", classificacao: "neutro",
    objecoes: ["Sela saco grosso?", "Pilha vem junto?", "Esquenta muito?"],
  },
  {
    id: "brinquedo-engracado", nome: "Brinquedo dançante para pet",
    imagem: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=70",
    pais: "BR", plataforma: "TikTok Shop", categoria: "Pets", nicho: "Pets",
    preco: 39, comissao: 18, ticketMedio: 41,
    beneficio: "Diverte o pet por horas",
    dor: "Pet entediado em casa", publico: "Tutores 20-45",
    avaliacao: 4.1, reviews: 412, reclamacoes: ["Quebra fácil", "Bateria fraca"],
    estoque: 220, entregaDias: 9, devolucao: 6.8,
    concorrencia: "alta", saturacao: "alta",
    facilidadeVisual: 86, antesDepois: 40, clarezaDor: 48, impulso: 72,
    risco: "alto", potencialVideo: 70, potencialCarrossel: 38,
    score: 41, status: "evitar", classificacao: "view bait",
    objecoes: ["Quebra fácil?", "Bateria dura?", "Faz barulho alto?"],
  },
  {
    id: "escova-removedora", nome: "Escova removedora de pelos",
    imagem: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&q=70",
    pais: "BR", plataforma: "TikTok Shop", categoria: "Pets", nicho: "Pets",
    preco: 69, comissao: 25, ticketMedio: 72,
    beneficio: "Remove 90% dos pelos soltos",
    dor: "Pelo no sofá e na roupa", publico: "Tutores 25-50",
    avaliacao: 4.7, reviews: 1820, reclamacoes: ["Cabo escorrega"],
    estoque: 410, entregaDias: 6, devolucao: 2.6,
    concorrencia: "média", saturacao: "média",
    facilidadeVisual: 94, antesDepois: 96, clarezaDor: 92, impulso: 84,
    risco: "baixo", potencialVideo: 92, potencialCarrossel: 90,
    score: 90, status: "aprovado", classificacao: "conversão silenciosa",
    objecoes: ["Machuca o pet?", "Funciona em pelo curto?", "Pode lavar?"],
  },
];

export type Avatar = {
  id: string; nome: string; nichos: string[]; idiomas: string[]; descricao: string;
  fotosCanonicas: number; estilos: string[]; cenarios: string[];
  formatos: string[]; tipo: "vídeo" | "carrossel" | "ambos";
  restricoes: string; status: "ativo" | "pausado";
  custoMedio: number; vendasAtribuidas: number; custoPorVenda: number; roi: number;
};

export const avatares: Avatar[] = [
  { id: "marina-br", nome: "Marina BR", nichos: ["Casa", "Beleza"], idiomas: ["PT-BR"],
    descricao: "Mulher 32, sorriso natural, ar acolhedor.", fotosCanonicas: 8,
    estilos: ["casual", "lifestyle"], cenarios: ["cozinha", "sala", "varanda"],
    formatos: ["carrossel 7", "vídeo 12s"], tipo: "ambos", restricoes: "Sem nichos adultos",
    status: "ativo", custoMedio: 16, vendasAtribuidas: 1820, custoPorVenda: 0.98, roi: 28.4 },
  { id: "aya-jp", nome: "Aya JP", nichos: ["Beleza", "Skincare"], idiomas: ["PT-BR", "EN"],
    descricao: "Mulher 27, pele luminosa, vibe minimalista.", fotosCanonicas: 5,
    estilos: ["clean", "editorial"], cenarios: ["banheiro", "vanity"],
    formatos: ["vídeo 12s"], tipo: "vídeo", restricoes: "—",
    status: "ativo", custoMedio: 18, vendasAtribuidas: 2410, custoPorVenda: 0.82, roi: 33.1 },
  { id: "tom-br", nome: "Tom BR", nichos: ["Pets", "Casa"], idiomas: ["PT-BR"],
    descricao: "Homem 30, descontraído, tom amigo.", fotosCanonicas: 5,
    estilos: ["casual"], cenarios: ["sala", "área externa"],
    formatos: ["vídeo 15s"], tipo: "vídeo", restricoes: "—",
    status: "ativo", custoMedio: 17, vendasAtribuidas: 380, custoPorVenda: 2.18, roi: 8.9 },
  { id: "lia-br", nome: "Lia BR", nichos: ["Moda", "Beleza"], idiomas: ["PT-BR"],
    descricao: "Mulher 24, energia jovem.", fotosCanonicas: 1,
    estilos: ["streetwear"], cenarios: ["urbano"],
    formatos: ["vídeo 9s"], tipo: "vídeo", restricoes: "Validar performance",
    status: "pausado", custoMedio: 15, vendasAtribuidas: 0, custoPorVenda: 0, roi: 0 },
];

export type Campanha = {
  id: string; nome: string; perfilOuCliente: string; produto: string;
  status: "rascunho" | "em produção" | "em revisão" | "publicada" | "encerrada";
  criativos: number; publicados: number; vendas: number; receita: number; custo: number;
  inicio: string;
};

export const campanhas: Campanha[] = [
  { id: "c1", nome: "Organizador magnético — Junho", perfilOuCliente: "Casa Inteligente",
    produto: "Organizador magnético", status: "publicada",
    criativos: 8, publicados: 8, vendas: 412, receita: 12340, custo: 145, inicio: "2026-06-01" },
  { id: "c2", nome: "Sérum VitC — Onda 2", perfilOuCliente: "Beleza Viral",
    produto: "Sérum Vitamina C 20%", status: "publicada",
    criativos: 12, publicados: 10, vendas: 980, receita: 31200, custo: 220, inicio: "2026-06-03" },
  { id: "c3", nome: "Mini seladora — Teste", perfilOuCliente: "Casa Inteligente",
    produto: "Mini seladora portátil", status: "em produção",
    criativos: 5, publicados: 0, vendas: 0, receita: 0, custo: 90, inicio: "2026-06-09" },
  { id: "c4", nome: "Pet Prime — Escova", perfilOuCliente: "Pet Prime",
    produto: "Escova removedora de pelos", status: "em revisão",
    criativos: 6, publicados: 0, vendas: 0, receita: 0, custo: 110, inicio: "2026-06-08" },
];

export type Criativo = {
  id: string; titulo: string; tipo: "vídeo" | "carrossel"; formato: string;
  produto: string; avatar: string; gancho: string;
  status: "em produção" | "aprovação" | "aprovado" | "publicado" | "rejeitado";
  custo: number; views?: number; cliques?: number; vendas?: number;
};

export const criativos: Criativo[] = [
  { id: "k1", titulo: "Antes/Depois — bancada limpa", tipo: "carrossel", formato: "7 imagens",
    produto: "Organizador magnético", avatar: "Marina BR",
    gancho: "Eu não sabia que precisava disso", status: "publicado",
    custo: 14, views: 184000, cliques: 5800, vendas: 198 },
  { id: "k2", titulo: "Pele em 7 dias", tipo: "vídeo", formato: "12s",
    produto: "Sérum Vitamina C 20%", avatar: "Aya JP",
    gancho: "Em 7 dias minha pele mudou", status: "publicado",
    custo: 22, views: 412000, cliques: 14200, vendas: 520 },
  { id: "k3", titulo: "Demo seladora cozinha", tipo: "vídeo", formato: "9s",
    produto: "Mini seladora portátil", avatar: "Marina BR",
    gancho: "Comida nunca mais estragou", status: "aprovação", custo: 18 },
  { id: "k4", titulo: "Removendo pelo do sofá", tipo: "vídeo", formato: "15s",
    produto: "Escova removedora de pelos", avatar: "Tom BR",
    gancho: "Meu cachorro parou de soltar pelo", status: "aprovado", custo: 17 },
  { id: "k5", titulo: "Carrossel — 5 usos do organizador", tipo: "carrossel", formato: "5 imagens",
    produto: "Organizador magnético", avatar: "Marina BR",
    gancho: "5 usos que eu não imaginava", status: "em produção", custo: 12 },
];

export type Publicacao = {
  id: string; criativo: string; perfil: string; data: string;
  views: number; cliques: number; vendas: number; receita: number; custo: number;
};

export const publicacoes: Publicacao[] = [
  { id: "p1", criativo: "Antes/Depois — bancada limpa", perfil: "Casa Inteligente",
    data: "2026-06-04", views: 184000, cliques: 5800, vendas: 198, receita: 5940, custo: 14 },
  { id: "p2", criativo: "Pele em 7 dias", perfil: "Beleza Viral",
    data: "2026-06-05", views: 412000, cliques: 14200, vendas: 520, receita: 16640, custo: 22 },
  { id: "p3", criativo: "Removendo pelo do sofá", perfil: "Pet Achadinhos",
    data: "2026-06-07", views: 92000, cliques: 1180, vendas: 38, receita: 912, custo: 17 },
  { id: "p4", criativo: "Carrossel — 5 usos do organizador", perfil: "Casa Inteligente",
    data: "2026-06-09", views: 64000, cliques: 1820, vendas: 71, receita: 2130, custo: 12 },
];

export const trend7d = [
  { dia: "Sex", views: 220, vendas: 180, custo: 60 },
  { dia: "Sáb", views: 310, vendas: 240, custo: 80 },
  { dia: "Dom", views: 280, vendas: 260, custo: 70 },
  { dia: "Seg", views: 410, vendas: 380, custo: 110 },
  { dia: "Ter", views: 380, vendas: 360, custo: 90 },
  { dia: "Qua", views: 520, vendas: 480, custo: 120 },
  { dia: "Qui", views: 610, vendas: 540, custo: 130 },
];

export function totalCustoCriativos() {
  return criativos.reduce((s, c) => s + c.custo, 0);
}
export function totalReceita() {
  return publicacoes.reduce((s, p) => s + p.receita, 0);
}
export function totalVendas() {
  return publicacoes.reduce((s, p) => s + p.vendas, 0);
}
export function totalViews() {
  return publicacoes.reduce((s, p) => s + p.views, 0);
}
