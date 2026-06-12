import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { perfis, totalReceita, totalVendas, totalViews, totalCustoCriativos } from "@/lib/mock/data";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Eye, ShoppingCart, DollarSign, Zap } from "lucide-react";

export const Route = createFileRoute("/resultados")({
  head: () => ({ meta: [{ title: "Resultados — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

function Page() {
  const data = perfis.map((p) => ({
    nome: p.nome,
    "vendas/1k": p.metricas.vendasPor1k,
    ROI: p.metricas.roi,
  }));
  return (
    <PageShell title="Resultados" description="Performance agregada por perfil e por métrica de aprendizado.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Views totais" value={fmt(totalViews())} icon={Eye} />
        <MetricCard label="Vendas totais" value={fmt(totalVendas())} icon={ShoppingCart} tone="brand" />
        <MetricCard label="Receita total" value={brl(totalReceita())} icon={DollarSign} tone="success" />
        <MetricCard label="Custo total" value={brl(totalCustoCriativos())} icon={Zap} tone="warning" />
      </div>
      <Card className="bg-card/70 mt-4">
        <CardHeader><CardTitle className="text-base">Vendas/1k views × ROI por perfil</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="vendas/1k" fill="var(--color-chart-1)" radius={[6,6,0,0]} />
                <Bar dataKey="ROI" fill="var(--color-chart-2)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
