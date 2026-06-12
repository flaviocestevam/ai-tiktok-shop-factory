import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProduto } from "@/integrations/supabase/hooks";
import {
  ChevronLeft, AlertTriangle, Sparkles, Target, MessageCircleQuestion,
  CheckCircle2, Eye, Film, Images, Wand2,
} from "lucide-react";

export const Route = createFileRoute("/produtos/$id")({
  head: () => ({ meta: [{ title: "Produto — Video Factory" }] }),
  component: ProdutoDetail,
});

function ProdutoDetail() {
  const { id } = useParams({ from: "/produtos/$id" });
  const { data: p, isLoading } = useProduto(id);

  if (isLoading) {
    return (
      <PageShell title="Carregando..." description="Buscando dados do produto...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  if (!p) {
    return (
      <PageShell title="Produto não encontrado">
        <p className="text-muted-foreground">Esse produto não existe.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/produtos">Voltar para produtos</Link>
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={p.nome}
      description={`${p.nicho || "Geral"} • ${p.pais || "Brasil"}`}
      actions={<Button asChild variant="ghost" size="sm"><Link to="/produtos"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card/70 overflow-hidden">
          <div className="aspect-[21/9] bg-muted overflow-hidden">
            <img src={p.link_tiktok || "/placeholder.svg"} alt={p.nome} className="h-full w-full object-cover" />
          </div>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">{p.status}</Badge>
              <Badge variant="outline" className="capitalize">Tipo: {p.recomendacao_tipo || "Geral"}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <Field label="Preço" value={`R$${(p.preco || 0).toFixed(2)}`} />
              <Field label="Comissão" value={`${p.comissao_pct}%`} />
              <Field label="Clareza da dor" value={`${p.score}/100`} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <Box title="Dor que resolve" body={p.dor || "—"} />
              <Box title="Oferta irresistível" body={p.oferta || "—"} />
              <Box title="Público-alvo" body={p.publico || "—"} />
              <Box title="Observações" body={p.observacoes || "—"} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardDescription>Score de Chance de Venda</CardDescription>
            <CardTitle className="font-display text-5xl text-gradient-brand">{p.score}/100</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Score label="Facilidade visual" v={p.facilidade_visual || 50} />
            <Score label="Antes e depois" v={p.tem_antes_depois ? 90 : 20} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="bg-card/70 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Simulador de Campanha</CardTitle>
            <CardDescription>Cálculo da fábrica com base no produto.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <SimItem k="Sugestão" v={p.recomendacao_tipo || "Mista"} />
            <SimItem k="V/criativo alvo" v="8+" />
            <SimItem k="Custo est." v="R$12,50" />
            <div className="md:col-span-4">
              <Button size="sm" className="gap-1.5"><Target className="h-4 w-4" />Criar campanha rápida</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4 text-primary" />Classificação</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
             <p className="text-muted-foreground">Sistema classificará automaticamente após as primeiras 1k visualizações.</p>
          </CardContent>
        </Card>
      </div>
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
