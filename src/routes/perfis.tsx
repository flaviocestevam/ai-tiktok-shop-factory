import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import { perfis } from "@/lib/mock/data";

export const Route = createFileRoute("/perfis")({
  head: () => ({ meta: [{ title: "Meus Perfis — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  return (
    <PageShell
      title="Meus Perfis"
      description="Perfis próprios de TikTok Shop. Cada perfil tem produtos, campanhas e métricas de aprendizado."
      actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Novo perfil</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {perfis.map((p) => (
          <Card key={p.id} className="bg-card/70 hover:border-primary/40 transition overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    {p.status}
                  </Badge>
                  <h3 className="font-display text-xl font-semibold mt-2">{p.nome}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.nicho} • {p.pais}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-[var(--gradient-brand)] grid place-items-center text-primary-foreground font-display font-bold">
                  {p.nome.charAt(0)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{p.descricao}</p>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Stat label="ROI" value={`${p.metricas.roi.toFixed(1)}x`} />
                <Stat label="Vendas" value={p.metricas.vendas.toLocaleString("pt-BR")} />
                <Stat label="Receita" value={brl(p.metricas.receita)} />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.produtosAtivos} produtos • {p.campanhasVinculadas} campanhas</span>
                <Link to="/perfis/$id" params={{ id: p.id }} className="inline-flex items-center gap-1 text-primary hover:underline">
                  Abrir <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display font-semibold text-sm mt-0.5">{value}</div>
    </div>
  );
}
