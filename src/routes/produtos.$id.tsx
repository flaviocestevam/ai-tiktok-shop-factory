import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { produtos } from "@/lib/mock/data";
import {
  ChevronLeft, AlertTriangle, Sparkles, Target, MessageCircleQuestion,
  CheckCircle2, Eye,
} from "lucide-react";

export const Route = createFileRoute("/produtos/$id")({
  loader: ({ params }) => {
    const p = produtos.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.p.nome ?? "Produto"} — Video Factory` }] }),
  component: ProdutoDetail,
  notFoundComponent: () => (
    <PageShell title="Produto não encontrado"><p className="text-muted-foreground">Esse produto não existe.</p></PageShell>
  ),
});

function ProdutoDetail() {
  const { p } = Route.useLoaderData();
  const viewBait = p.classificacao === "view bait";
  const silenciosa = p.classificacao === "conversão silenciosa";

  return (
    <PageShell
      title={p.nome}
      description={`${p.categoria} • ${p.nicho} • ${p.pais}`}
      actions={<Button asChild variant="ghost" size="sm"><Link to="/produtos"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card/70 overflow-hidden">
          <div className="aspect-[21/9] bg-muted overflow-hidden">
            <img src={p.imagem} alt={p.nome} className="h-full w-full object-cover" />
          </div>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">{p.status}</Badge>
              <Badge variant="outline">Risco: {p.risco}</Badge>
              <Badge variant="outline">Concorrência: {p.concorrencia}</Badge>
              <Badge variant="outline">Saturação: {p.saturacao}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <Field label="Preço" value={`R$${p.preco.toFixed(2)}`} />
              <Field label="Comissão" value={`${p.comissao}%`} />
              <Field label="Ticket médio" value={`R$${p.ticketMedio}`} />
              <Field label="Devolução" value={`${p.devolucao}%`} />
              <Field label="Avaliação" value={`${p.avaliacao} ★`} />
              <Field label="Reviews" value={p.reviews.toLocaleString("pt-BR")} />
              <Field label="Estoque" value={p.estoque.toString()} />
              <Field label="Entrega" value={`${p.entregaDias} dias`} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <Box title="Benefício principal" body={p.beneficio} />
              <Box title="Dor que resolve" body={p.dor} />
              <Box title="Público-alvo" body={p.publico} />
              <Box title="Reclamações comuns" body={p.reclamacoes.join(" • ") || "—"} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardDescription>Chance de venda</CardDescription>
            <CardTitle className="font-display text-5xl text-gradient-brand">{p.score}/100</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Score label="Clareza da dor" v={p.clarezaDor} />
            <Score label="Facilidade visual" v={p.facilidadeVisual} />
            <Score label="Força do antes/depois" v={p.antesDepois} />
            <Score label="Compra por impulso" v={p.impulso} />
            <Score label="Potencial vídeo" v={p.potencialVideo} />
            <Score label="Potencial carrossel" v={p.potencialCarrossel} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="bg-card/70 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Simulador de Campanha</CardTitle>
            <CardDescription>Sugestão da fábrica antes de produzir.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <SimItem k="Criativos sugeridos" v="5" />
            <SimItem k="Carrosséis" v="3" />
            <SimItem k="Vídeos" v="2" />
            <SimItem k="Custo estimado" v="R$18" />
            <SimItem k="Meta de vendas" v="4 vendas" />
            <SimItem k="CPV máximo" v="R$4,50" />
            <SimItem k="Avatar sugerido" v="Marina BR" />
            <SimItem k="Gancho sugerido" v="Descoberta" />
            <div className="md:col-span-4">
              <Button size="sm" className="gap-1.5"><Target className="h-4 w-4" />Criar campanha com essas configurações</Button>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-card/70 ${viewBait ? "border-destructive/40" : silenciosa ? "border-success/40" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {viewBait ? <AlertTriangle className="h-4 w-4 text-destructive" /> :
               silenciosa ? <CheckCircle2 className="h-4 w-4 text-success" /> :
               <Eye className="h-4 w-4" />}
              Classificação automática
            </CardTitle>
            <CardDescription className="capitalize">{p.classificacao}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {viewBait && (
              <>
                <p className="text-muted-foreground">Sinais: muitas views, poucas vendas, baixa utilidade prática.</p>
                <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
                  Ação: <strong>não escalar</strong> só por views. Validar vendas/1k antes de produzir mais.
                </div>
              </>
            )}
            {silenciosa && (
              <>
                <p className="text-muted-foreground">Sinais: poucas views, ótima conversão, baixo custo por venda.</p>
                <div className="rounded-md border border-success/20 bg-success/5 px-3 py-2">
                  Ação: <strong>escalar variações</strong> de baixo custo, priorizando carrosséis e vídeos curtos.
                </div>
              </>
            )}
            {!viewBait && !silenciosa && (
              <p className="text-muted-foreground">Sem sinais claros. Manter teste controlado de 5 criativos.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircleQuestion className="h-4 w-4 text-primary" /> Banco de objeções
          </CardTitle>
          <CardDescription>Usado para gerar carrosséis e vídeos respondendo dúvidas reais de compra.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {p.objecoes.map((o, i) => (
            <Badge key={i} variant="outline" className="text-sm py-1.5 px-3 font-normal">"{o}"</Badge>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5"><MessageCircleQuestion className="h-4 w-4" />Adicionar objeção</Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
function Box({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{title}</div>
      <div>{body}</div>
    </div>
  );
}
function Score({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{v}/100</span>
      </div>
      <Progress value={v} className="h-2" />
    </div>
  );
}
function SimItem({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="font-display font-semibold mt-0.5">{v}</div>
    </div>
  );
}
