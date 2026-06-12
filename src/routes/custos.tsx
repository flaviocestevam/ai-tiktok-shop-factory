import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { perfis, clientes } from "@/lib/mock/data";
import { useCustos, usePerfis } from "@/integrations/supabase/hooks";
import { Wallet, Coins, ReceiptText, Percent, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/custos")({
  head: () => ({ meta: [{ title: "Custos — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

function Page() {
  const g = custosBreakdown.geral;

  return (
    <PageShell title="Custos" description="Custo por foto, vídeo, carrossel, voz, render, storage, campanha, produto, avatar, perfil e cliente.">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard label="Custo IA" value={brl(g.custoIA)} icon={Coins} tone="warning" />
        <MetricCard label="Storage" value={brl(g.custoStorage)} icon={Wallet} />
        <MetricCard label="Ferramentas" value={brl(g.custoFerramentas)} icon={ReceiptText} />
        <MetricCard label="Receita total" value={brl(g.receitaTotal)} icon={TrendingUp} tone="success" />
        <MetricCard label="Margem geral" value={`${g.margem}%`} icon={Percent} tone="success" />
      </div>

      <Tabs defaultValue="campanha" className="mt-6">
        <TabsList>
          <TabsTrigger value="campanha">Por Campanha</TabsTrigger>
          <TabsTrigger value="perfil">Por Perfil</TabsTrigger>
          <TabsTrigger value="cliente">Por Cliente</TabsTrigger>
          <TabsTrigger value="geral">Dashboard Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="campanha">
          <Card className="bg-card/70">
            <CardHeader>
              <CardDescription>Campanha exemplo</CardDescription>
              <CardTitle className="text-base">{custosBreakdown.campanha.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Stat k="Vídeos" v={String(custosBreakdown.campanha.videosGerados)} />
                <Stat k="Carrosséis" v={String(custosBreakdown.campanha.carrosseisGerados)} />
                <Stat k="Publicados" v={String(custosBreakdown.campanha.criativosPublicados)} />
              </div>
              <div className="rounded-md border border-border divide-y divide-border">
                {custosBreakdown.campanha.items.map((it) => (
                  <div key={it.label} className="flex justify-between px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Custo {it.label.toLowerCase()}</span>
                    <span className="font-medium">{brl(it.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between px-3 py-2 text-sm bg-muted/40">
                  <span>Custo total</span>
                  <span className="font-bold text-warning">{brl(custosBreakdown.campanha.total)}</span>
                </div>
                <div className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Receita atribuída</span>
                  <span className="font-medium text-success">{brl(custosBreakdown.campanha.receita)}</span>
                </div>
                <div className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Lucro estimado</span>
                  <span className="font-bold text-success">{brl(custosBreakdown.campanha.lucro)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Stat k="ROI" v={`${custosBreakdown.campanha.roi}%`} tone="success" />
                <Stat k="Custo/criativo" v={brl(custosBreakdown.campanha.custoPorCriativo)} />
                <Stat k="Custo/venda" v={brl(custosBreakdown.campanha.custoPorVenda)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfil">
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle className="text-base">Custos por perfil próprio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {perfis.map((p) => (
                <div key={p.id} className="rounded-md border border-border bg-card px-3 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{p.nome}</div>
                      <div className="text-xs text-muted-foreground">{p.metricas.criativos} criativos · ROI {p.metricas.roi}x</div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <Stat k="Custo/criativo" v={brl(p.metricas.custoPorCriativo)} />
                      <Stat k="Custo/venda" v={brl(p.metricas.custoPorVenda)} />
                      <Stat k="Total" v={brl(p.metricas.custoProducao)} tone="warning" />
                      <Stat k="Lucro" v={brl(p.metricas.lucro)} tone="success" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cliente">
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle className="text-base">Custos por cliente recorrente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {clientes.map((c) => {
                const lucro = c.valor - c.custoProducao;
                const margem = ((lucro / c.valor) * 100).toFixed(1);
                return (
                  <div key={c.id} className="rounded-md border border-border bg-card px-3 py-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{c.empresa}</div>
                      <div className="text-xs text-muted-foreground">Plano {brl(c.valor)}/mês</div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <Stat k="Custo produção" v={brl(c.custoProducao)} tone="warning" />
                      <Stat k="Lucro bruto" v={brl(lucro)} tone="success" />
                      <Badge className="bg-success/15 text-success border-success/30">{margem}% margem</Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geral">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/70">
              <CardHeader><CardTitle className="text-base">Custos operacionais</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row k="Custo total com IA" v={brl(g.custoIA)} />
                <Row k="Custo de storage" v={brl(g.custoStorage)} />
                <Row k="Custo de ferramentas" v={brl(g.custoFerramentas)} />
                <Row k="Custo total operacional" v={brl(g.custoOperacional)} bold tone="warning" />
              </CardContent>
            </Card>
            <Card className="bg-card/70">
              <CardHeader><CardTitle className="text-base">Receita & lucro</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row k="Receita com clientes" v={brl(g.receitaClientes)} />
                <Row k="Comissão dos perfis próprios" v={brl(g.comissaoPerfis)} />
                <Row k="Receita total" v={brl(g.receitaTotal)} bold tone="success" />
                <Row k="Lucro estimado" v={brl(g.lucro)} bold tone="success" />
                <Row k="Margem geral" v={`${g.margem}%`} bold tone="success" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-card px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`text-sm font-semibold ${c}`}>{v}</div>
    </div>
  );
}

function Row({ k, v, bold, tone }: { k: string; v: string; bold?: boolean; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="flex justify-between px-3 py-2 rounded-md hover:bg-accent/40">
      <span className="text-muted-foreground">{k}</span>
      <span className={`${bold ? "font-bold" : ""} ${c}`}>{v}</span>
    </div>
  );
}
