
# AI TikTok Shop Video Factory — Plano de Construção

Aplicação **interna** (sem login público, sem área para cliente). Foco: descobrir o que vende mais com menor custo e menor esforço, aprendendo com resultados reais via TikTok API.

Dado o tamanho do escopo, proponho construir em **fases**. Esta primeira entrega é a Fase 1 — toda a estrutura de navegação, design system, mocks ricos e as telas centrais funcionais (sem backend ainda). Depois ativamos Lovable Cloud + integração TikTok nas fases seguintes.

---

## Fase 1 — Shell, Design System e Telas Centrais (esta entrega)

### Design
- Estética: SaaS interno profissional, denso de informação mas respirável. Inspiração: Linear + Vercel + Notion analytics.
- Tema escuro por padrão com acento vibrante (provavelmente coral/laranja TikTok-adjacente, sem copiar). Tokens em `oklch` no `src/styles.css`.
- Componentes: sidebar colapsável, top bar com seletor de período (hoje / 7d / mês / vida toda), cards de métrica, tabelas com filtros, badges de status, gráficos (Recharts), abas, drawers.
- Tipografia: par display + sans neutra (não Inter).

### Estrutura de navegação (sidebar agrupada)
```
Visão
  • Dashboard Geral
Operação
  • Meus Perfis
  • Clientes
  • Produtos
  • Avatares
  • Campanhas
Fábrica
  • Produção
  • Criativos Finais
  • Publicações
  • Aprovações Internas
  • Entregas
Inteligência
  • Resultados
  • Diagnóstico de Conversão
  • Menor Esforço, Maior Venda
  • Inteligência da Fábrica
  • Recomendações
  • Custos
Sistema
  • Configurações
  • Configurações > Provedores de IA
```

### Rotas (TanStack file-based, em `src/routes/`)
- `__root.tsx` com `SidebarProvider` + sidebar + top bar
- `index.tsx` → Dashboard Geral
- `perfis.tsx` (lista) + `perfis.$id.tsx` (detalhe com abas: Visão Geral, Publicações, Produtos, Formatos, Avatares, Ganchos, Custos, Recomendações, Diagnóstico de Conversão)
- `clientes.tsx` + `clientes.$id.tsx` (dashboard de margem/lucro)
- `produtos.tsx` + `produtos.$id.tsx` (com Score de Chance de Venda, Simulador de Campanha, Detector View Bait, Detector Conversão Silenciosa, Banco de Objeções)
- `avatares.tsx` + `avatares.$id.tsx` (biblioteca + fotos canônicas)
- `campanhas.tsx`, `producao.tsx`, `criativos.tsx`, `publicacoes.tsx`, `resultados.tsx`
- `diagnostico.tsx`, `menor-esforco.tsx`, `inteligencia.tsx`, `custos.tsx`, `recomendacoes.tsx`
- `aprovacoes.tsx`, `entregas.tsx`
- `configuracoes.tsx` + `configuracoes.provedores.tsx`

### Dados (mock) — `src/lib/mock/`
Arquivos TS com tipos fortes para: Perfis, Clientes, Produtos, Avatares, Campanhas, Criativos, Publicações, Métricas. Inclui os 3 perfis exemplo (Casa Inteligente, Beleza Viral, Pet Achadinhos) e cliente exemplo "Loja X" com a margem 79,4%.

### Telas com prioridade visual nesta fase
1. **Dashboard Geral** — KPIs cross-perfil/cliente, melhores produtos, melhor formato, melhor avatar, recomendações automáticas, gráficos de ROI e custo/venda.
2. **Detalhe de Perfil Próprio** — todas as métricas listadas, abas completas, badges "repetir / evitar".
3. **Detalhe de Cliente** — foco em margem, contratado vs entregue, lucro bruto.
4. **Detalhe de Produto** — Score 0-100, Simulador, detectores (View Bait / Conversão Silenciosa), Banco de Objeções.
5. **Avatares** — grid com fotos canônicas (placeholder), histórico de performance.

Demais módulos ficam com layout pronto + dados mock + UI funcional (filtros, ordenação) para já dar a sensação de produto completo.

### Stack técnico
- TanStack Start + Router (já no template)
- Tailwind v4 com tokens semânticos em `src/styles.css`
- shadcn/ui (sidebar, table, tabs, card, badge, dialog, drawer, dropdown, select, input, chart)
- Recharts para gráficos
- Estado local + mock; sem backend nesta fase

---

## Fase 2 — Backend (Lovable Cloud)
Schema (perfis, clientes, produtos, avatares, campanhas, criativos, publicações, métricas, objeções, custos), RLS, server functions para CRUD, upload de fotos canônicas.

## Fase 3 — Integração TikTok + Cálculo de Aprendizado
Conector TikTok via gateway, ingestão de métricas reais por publicação, motor que calcula: vendas/1.000 views, custo/venda, melhor formato/avatar/gancho, classificação automática View Bait vs Conversão Silenciosa, recomendações "repetir / evitar".

## Fase 4 — Provedores de IA + Produção
Tela de Configurações > Provedores de IA, geração de roteiros, geração de imagens para carrosséis, montagem de vídeos, fluxo Produção → Aprovação Interna → Entrega.

---

## O que entrego agora se você aprovar
- Toda a navegação e design system.
- Todas as rotas criadas com layout + mocks ricos.
- Telas centrais (Dashboard Geral, Perfil, Cliente, Produto, Avatares) com profundidade visual e os indicadores que você listou já renderizados a partir de dados mock realistas.
- Base pronta para plugar Lovable Cloud e TikTok nas próximas fases sem retrabalho.

Confirma que sigo por aqui? Se quiser, já aponto qual fase priorizar depois (eu sugeriria: Cloud + schema → integração TikTok → IA de produção).
