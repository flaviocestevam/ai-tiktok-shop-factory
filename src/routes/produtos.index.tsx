import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProdutos } from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/produtos/")({
  head: () => ({ meta: [{ title: "Produtos — Video Factory" }] }),
  component: Page,
});

const statusColor: Record<string, string> = {
  ativo: "bg-success/15 text-success border-success/30",
  pausado: "bg-muted text-muted-foreground border-border",
  vencedor: "bg-success/15 text-success border-success/30",
  teste: "bg-warning/15 text-warning border-warning/30",
};

function Page() {
  const { data: produtos, isLoading } = useProdutos();

  if (isLoading) {
    return (
      <PageShell title="Produtos" description="Carregando produtos...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-56 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Produtos"
      description="Produtos do TikTok Shop que você promove."
      actions={
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo produto
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {produtos?.map((p: any) => (
          <Link key={p.id} to="/produtos/$id" params={{ id: p.id }}>
            <Card className="bg-card/70 hover:border-primary/40 transition overflow-hidden h-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.nome}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.nicho || "—"}</div>
                  </div>
                  <Badge className={statusColor[p.status] ?? "border-border"}>{p.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <Stat label="Preço" value={`R$${Number(p.preco || 0).toFixed(0)}`} />
                  <Stat label="Comissão" value={`${p.comissao_pct || 0}%`} />
                  <Stat label="Score" value={String(p.score || 0)} />
                </div>
                {p.link_tiktok && (
                  <div className="mt-3 text-[11px] text-muted-foreground truncate">
                    {p.link_tiktok}
                  </div>
                )}
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
