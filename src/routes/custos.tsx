import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { perfis, clientes } from "@/lib/mock/data";
import { Wallet, Coins, ReceiptText, Percent } from "lucide-react";

export const Route = createFileRoute("/custos")({
  head: () => ({ meta: [{ title: "Custos — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  const custoPerfis = perfis.reduce((s, p) => s + p.metricas.custoProducao, 0);
  const custoClientes = clientes.reduce((s, c) => s + c.custoProducao, 0);
  const total = custoPerfis + custoClientes;
  const receitaClientes = clientes.reduce((s, c) => s + c.valor, 0);
  const margemMedia = ((receitaClientes - custoClientes) / receitaClientes) * 100;

  return (
    <PageShell title="Custos" description="Visão financeira da fábrica.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Custo total" value={brl(total)} icon={Wallet} tone="warning" />
        <MetricCard label="Custo (Meus Perfis)" value={brl(custoPerfis)} icon={Coins} />
        <MetricCard label="Custo (Clientes)" value={brl(custoClientes)} icon={ReceiptText} />
        <MetricCard label="Margem média (clientes)" value={`${margemMedia.toFixed(1)}%`} icon={Percent} tone="success" />
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader><CardTitle className="text-base">Custo por perfil próprio</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {perfis.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
              <span>{p.nome}</span>
              <div className="flex gap-6 text-xs">
                <span className="text-muted-foreground">Custo/criativo <strong className="text-foreground">{brl(p.metricas.custoPorCriativo)}</strong></span>
                <span className="text-muted-foreground">Custo/venda <strong className="text-foreground">{brl(p.metricas.custoPorVenda)}</strong></span>
                <span className="text-muted-foreground">Total <strong className="text-warning">{brl(p.metricas.custoProducao)}</strong></span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
