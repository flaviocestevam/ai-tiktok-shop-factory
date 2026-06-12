import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePerfil } from "@/integrations/supabase/hooks";
import {
  Eye, ShoppingCart, DollarSign, Target, TrendingUp, Zap, ChevronLeft,
  CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Clock
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area,
} from "recharts";

export const Route = createFileRoute("/perfis/$id")({
  head: () => ({
    meta: [{ title: `Detalhes do Perfil — Video Factory` }],
  }),
  component: PerfilDetail,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

function PerfilDetail() {
  const { id } = useParams({ from: "/perfis/$id" });
  const { data: perfil, isLoading } = usePerfil(id);

  if (isLoading) {
    return (
      <PageShell title="Carregando..." description="Buscando dados do perfil...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  if (!perfil) {
    return (
      <PageShell title="Perfil não encontrado">
        <p className="text-muted-foreground">Esse perfil não existe.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/perfis">Voltar para perfis</Link>
        </Button>
      </PageShell>
    );
  }

  const m = perfil.metricas;

  return (
    <PageShell
      title={perfil.nome}
      description={perfil.descricao || "Sem descrição disponível."}
      actions={
        <>
          <Button asChild variant="ghost" size="sm"><Link to="/perfis"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>
          <SyncButton profileId={perfil.id} />
          <Button size="sm" className="gap-1.5"><Sparkles className="h-4 w-4" />Nova campanha</Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <Badge variant="outline">{perfil.nicho}</Badge>
        <Badge variant="outline">{perfil.pais}</Badge>
        <Badge variant="outline">{perfil.plataforma}</Badge>
        <Badge className="bg-success/15 text-success border-success/30">{perfil.status}</Badge>
        
        {(perfil as any).conectores?.[0] && (
          <div className="flex items-center gap-2 ml-auto text-muted-foreground bg-muted/30 px-2 py-1 rounded border border-border/50">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> API Conectada</span>
            <span className="border-l border-border h-3 mx-1" />
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Sincronizado: {new Date((perfil as any).conectores[0].ultima_sync).toLocaleString('pt-BR')}</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <MetricCard label="Views" value={fmt(m.views)} icon={Eye} />
            <MetricCard label="Vendas" value={fmt(m.vendas)} icon={ShoppingCart} tone="brand" />
            <MetricCard label="Receita" value={brl(m.receita)} icon={DollarSign} tone="success" />
            <MetricCard label="Custo produção" value={brl(m.custoProducao)} icon={Zap} tone="warning" />
            <MetricCard label="Lucro" value={brl(m.lucro)} icon={TrendingUp} tone="success" />
            <MetricCard label="ROI" value={`${m.roi.toFixed(1)}x`} icon={Target} tone="info" />
          </div>

          <Card className="bg-card/70">
            <CardHeader className="pb-2"><CardTitle className="text-base">Métricas detalhadas</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Melhor produto" value={m.melhorProduto} tone="success" />
              <Row label="Melhor formato" value={m.melhorFormato} tone="success" />
              <Row label="Melhor avatar" value={m.melhorAvatar} tone="success" />
              <Row label="Melhor gancho" value={m.melhorGancho} tone="success" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custos" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Custo total" value={brl(m.custoProducao)} tone="warning" />
            <MetricCard label="Custo/criativo" value={brl(m.custoPorCriativo)} />
            <MetricCard label="Custo/venda" value={brl(m.custoPorVenda)} tone="brand" />
            <MetricCard label="Lucro" value={brl(m.lucro)} tone="success" />
          </div>
        </TabsContent>

        <TabsContent value="recomendacoes" className="mt-4 space-y-3">
          <Card className="bg-card/70">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Repetir</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              Aguardando aprendizados reais para gerar recomendações.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostico" className="mt-4">
          <Card className="bg-card/70">
            <CardHeader><CardTitle className="text-base">Diagnóstico de conversão</CardTitle><CardDescription>Por que cada produto vendeu ou não.</CardDescription></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="rounded-md border border-border bg-card px-3 py-2">Aguardando métricas suficientes para diagnóstico do perfil.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "brand" }) {
  const cls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${cls}`}>{value}</span>
    </div>
  );
}
