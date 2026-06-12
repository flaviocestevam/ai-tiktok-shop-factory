import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useProdutos } from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/produtos")({
  head: () => ({ meta: [{ title: "Produtos — Video Factory" }] }),
  component: Page,
});

const statusColor: Record<string, string> = {
  "vencedor": "bg-success/15 text-success border-success/30",
  "aprovado": "bg-info/15 text-info border-info/30",
  "em teste": "bg-warning/15 text-warning border-warning/30",
  "em análise": "bg-muted text-muted-foreground border-border",
  "rejeitado": "bg-destructive/15 text-destructive border-destructive/30",
  "evitar": "bg-destructive/15 text-destructive border-destructive/30",
  "pausado": "bg-muted text-muted-foreground border-border",
};

function Page() {
  const { data: produtos, isLoading } = useProdutos();

  if (isLoading) {
    return (
      <PageShell title="Produtos" description="Carregando produtos...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Produtos"
      description="Banco de produtos com Score de Chance de Venda, detectores e banco de objeções."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" />Filtrar</Button>
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Novo produto</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {produtos?.map((p) => (
          <Link key={p.id} to="/produtos/$id" params={{ id: p.id }}>
            <Card className="bg-card/70 hover:border-primary/40 transition overflow-hidden h-full">
              <div className="aspect-[16/9] bg-muted overflow-hidden">
                <img src={p.link_tiktok || "/placeholder.svg"} alt={p.nome} className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium">{p.nome}</div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                    <div className="font-display text-xl font-bold text-gradient-brand">{p.score}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <Badge variant="outline">{p.nicho}</Badge>
                  <Badge className={statusColor[p.status]}>{p.status}</Badge>
                  <Badge variant="outline" className="capitalize">{p.recomendacao_tipo || "Geral"}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <Stat label="Preço" value={`R$${(p.preco || 0).toFixed(0)}`} />
                  <Stat label="Comissão" value={`${p.comissao_pct}%`} />
                  <Stat label="Visual" value={`${p.facilidade_visual || 0}/10`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}


function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
