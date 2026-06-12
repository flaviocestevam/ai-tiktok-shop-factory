import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { criativos } from "@/lib/mock/data";

export const Route = createFileRoute("/menor-esforco")({
  head: () => ({ meta: [{ title: "Menor Esforço, Maior Venda — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  const ranked = criativos
    .filter((c) => c.vendas && c.custo)
    .map((c) => ({ ...c, eficiencia: (c.vendas! / c.custo) }))
    .sort((a, b) => b.eficiencia - a.eficiencia);

  return (
    <PageShell
      title="Menor Esforço, Maior Venda"
      description="Ranking dos criativos com maior vendas por real gasto na produção."
    >
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle className="text-base">Top eficiência</CardTitle>
          <CardDescription>Vendas / Custo de produção.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {ranked.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 grid place-items-center rounded-md bg-[var(--gradient-brand)] text-primary-foreground font-display font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium">{c.titulo}</div>
                  <div className="text-xs text-muted-foreground">{c.produto} • {c.avatar}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Badge variant="outline">{c.vendas} vendas</Badge>
                <Badge variant="outline">{brl(c.custo)} custo</Badge>
                <Badge className="bg-success/15 text-success border-success/30">
                  {c.eficiencia.toFixed(1)} vendas/R$
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
