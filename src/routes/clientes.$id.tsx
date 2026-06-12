import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clientes } from "@/lib/mock/data";
import { ChevronLeft, DollarSign, TrendingUp, Package, Send, Wallet, Percent } from "lucide-react";

export const Route = createFileRoute("/clientes/$id")({
  loader: ({ params }) => {
    const cliente = clientes.find((c) => c.id === params.id);
    if (!cliente) throw notFound();
    return { cliente };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.cliente.empresa ?? "Cliente"} — Video Factory` }] }),
  component: ClienteDetail,
  notFoundComponent: () => (
    <PageShell title="Cliente não encontrado"><p className="text-muted-foreground">Esse cliente não existe.</p></PageShell>
  ),
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function ClienteDetail() {
  const { cliente: c } = Route.useLoaderData();
  const totalContratado = c.videosContratados + c.carrosseisContratados;
  const lucro = c.valor - c.custoProducao;
  const margem = (lucro / c.valor) * 100;

  return (
    <PageShell
      title={c.empresa}
      description={`${c.nicho} • ${c.plano} • ${c.pais}`}
      actions={<Button asChild variant="ghost" size="sm"><Link to="/clientes"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>}
    >
      <div className="flex flex-wrap gap-2 text-xs mb-4">
        <Badge variant="outline">{c.whatsapp}</Badge>
        <Badge variant="outline">{c.email}</Badge>
        <Badge className="bg-success/15 text-success border-success/30">{c.status}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard label="Cobrança mensal" value={brl(c.valor)} icon={DollarSign} tone="brand" />
        <MetricCard label="Custo produção" value={brl(c.custoProducao)} icon={Wallet} tone="warning" />
        <MetricCard label="Lucro bruto" value={brl(lucro)} icon={TrendingUp} tone="success" />
        <MetricCard label="Margem" value={`${margem.toFixed(1)}%`} icon={Percent} tone="success" />
        <MetricCard label="Criativos contratados" value={totalContratado} icon={Package} />
        <MetricCard label="Criativos entregues" value={c.criativosEntregues} icon={Send} hint={`${c.criativosProduzidos - c.criativosEntregues} pendentes`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contrato vs Produção</CardTitle>
            <CardDescription>Acompanhamento do ciclo atual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Bar label="Vídeos" total={c.videosContratados} done={Math.min(c.videosContratados, Math.round(c.criativosEntregues * c.videosContratados / totalContratado))} />
            <Bar label="Carrosséis" total={c.carrosseisContratados} done={Math.min(c.carrosseisContratados, Math.round(c.criativosEntregues * c.carrosseisContratados / totalContratado))} />
            <Bar label="Total" total={totalContratado} done={c.criativosEntregues} />
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Saúde da conta</CardTitle>
            <CardDescription>Indicadores internos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Produtos ativos" v={c.produtosAtivos.toString()} />
            <Row k="Campanhas ativas" v={c.campanhas.toString()} />
            <Row k="Custo médio por criativo" v={brl(c.custoProducao / Math.max(c.criativosProduzidos, 1))} />
            <Row k="Receita média por criativo" v={brl(c.valor / Math.max(totalContratado, 1))} />
            <Row k="Observações" v={c.observacoes} small />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recomendação para próxima entrega</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="rounded-md border border-success/20 bg-success/5 px-3 py-2">
            Manter avatar Marina BR — melhor performance histórica no nicho do cliente.
          </div>
          <div className="rounded-md border border-info/20 bg-info/5 px-3 py-2">
            Testar carrosséis 5 imagens em vez de 7 — reduz custo em ~18% sem perda de conversão.
          </div>
          <div className="rounded-md border border-warning/20 bg-warning/5 px-3 py-2">
            Evitar vídeos longos &gt; 30s — histórico mostra queda forte de CVR.
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Bar({ label, total, done }: { label: string; total: number; done: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span>{done}/{total} • {pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-[var(--gradient-brand)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Row({ k, v, small }: { k: string; v: string; small?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-3 py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className={small ? "text-right text-muted-foreground" : "font-medium"}>{v}</span>
    </div>
  );
}
