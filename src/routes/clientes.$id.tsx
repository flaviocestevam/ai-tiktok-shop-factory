import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCliente } from "@/integrations/supabase/hooks";
import { ChevronLeft, DollarSign, TrendingUp, Package, Send, Wallet, Percent } from "lucide-react";

export const Route = createFileRoute("/clientes/$id")({
  head: () => ({ meta: [{ title: `Cliente — Video Factory` }] }),
  component: ClienteDetail,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function ClienteDetail() {
  const { id } = useParams({ from: "/clientes/$id" });
  const { data: c, isLoading } = useCliente(id);

  if (isLoading) {
    return (
      <PageShell title="Carregando..." description="Buscando dados do cliente...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  if (!c) {
    return (
      <PageShell title="Cliente não encontrado">
        <p className="text-muted-foreground">Esse cliente não existe.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/clientes">Voltar para clientes</Link>
        </Button>
      </PageShell>
    );
  }

  const vContratados = c.videos_contratados || 0;
  const cContratados = c.carrosseis_contratados || 0;
  const totalContratado = vContratados + cContratados;
  const valor = c.plano_mensal || 0;
  const custo = 0; // Simplified
  const lucro = valor - custo;
  const margem = valor > 0 ? (lucro / valor) * 100 : 0;

  return (
    <PageShell
      title={c.empresa}
      description={`${c.nicho || "Geral"} • ${c.pais || "Brasil"}`}
      actions={<Button asChild variant="ghost" size="sm"><Link to="/clientes"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>}
    >
      <div className="flex flex-wrap gap-2 text-xs mb-4">
        <Badge variant="outline">{c.contato_whatsapp || "Sem WhatsApp"}</Badge>
        <Badge variant="outline">{c.contato_email || "Sem e-mail"}</Badge>
        <Badge className="bg-success/15 text-success border-success/30">{c.status}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard label="Plano mensal" value={brl(valor)} icon={DollarSign} tone="brand" />
        <MetricCard label="Custo est." value={brl(custo)} icon={Wallet} tone="warning" />
        <MetricCard label="Lucro est." value={brl(lucro)} icon={TrendingUp} tone="success" />
        <MetricCard label="Margem" value={`${margem.toFixed(1)}%`} icon={Percent} tone="success" />
        <MetricCard label="Contratado" value={totalContratado} icon={Package} />
        <MetricCard label="Status" value={c.status} icon={Send} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contrato vs Produção</CardTitle>
            <CardDescription>Acompanhamento do ciclo atual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Bar label="Vídeos" total={vContratados} done={0} />
            <Bar label="Carrosséis" total={cContratados} done={0} />
            <Bar label="Total" total={totalContratado} done={0} />
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Dados da conta</CardTitle>
            <CardDescription>Indicadores internos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Contato" v={c.contato_nome || "—"} />
            <Row k="Observações" v={c.observacoes || "—"} small />
          </CardContent>
        </Card>
      </div>
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
