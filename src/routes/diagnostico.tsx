import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { perfis } from "@/lib/mock/data";

export const Route = createFileRoute("/diagnostico")({
  head: () => ({ meta: [{ title: "Diagnóstico de Conversão — Video Factory" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell title="Diagnóstico de Conversão" description="Por que cada perfil converte mais ou menos.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {perfis.map((p) => {
          const ok = p.metricas.vendasPor1k >= 0.6;
          return (
            <Card key={p.id} className={`bg-card/70 ${ok ? "border-success/40" : "border-warning/40"}`}>
              <CardHeader className="pb-2">
                <CardDescription>{p.nicho}</CardDescription>
                <CardTitle className="text-base">{p.nome}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <Diag k="Vendas/1k views" v={p.metricas.vendasPor1k.toFixed(2)} bom={p.metricas.vendasPor1k >= 0.6} alvo="≥ 0.6" />
                <Diag k="CTR" v={`${p.metricas.ctr}%`} bom={p.metricas.ctr >= 2} alvo="≥ 2%" />
                <Diag k="CVR" v={`${p.metricas.cvr}%`} bom={p.metricas.cvr >= 3} alvo="≥ 3%" />
                <Diag k="Custo/venda" v={`R$${p.metricas.custoPorVenda.toFixed(2)}`} bom={p.metricas.custoPorVenda <= 2} alvo="≤ R$2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

function Diag({ k, v, bom, alvo }: { k: string; v: string; bom: boolean; alvo: string }) {
  return (
    <div className={`flex items-center justify-between rounded-md border px-3 py-2 ${bom ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"}`}>
      <div>
        <div>{k}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">alvo {alvo}</div>
      </div>
      <div className={`font-display font-semibold ${bom ? "text-success" : "text-warning"}`}>{v}</div>
    </div>
  );
}
