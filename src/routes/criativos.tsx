import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { criativos } from "@/lib/mock/data";
import { PlayCircle, Images } from "lucide-react";

export const Route = createFileRoute("/criativos")({
  head: () => ({ meta: [{ title: "Criativos Finais — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  return (
    <PageShell title="Criativos Finais" description="Todos os criativos aprovados ou publicados.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {criativos.map((c) => (
          <Card key={c.id} className="bg-card/70 hover:border-primary/40 transition">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 rounded-lg bg-muted grid place-items-center">
                  {c.tipo === "vídeo" ? <PlayCircle className="h-6 w-6 text-primary" /> : <Images className="h-6 w-6 text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{c.titulo}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.produto} • {c.avatar}</div>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <Badge variant="outline" className="capitalize">{c.tipo}</Badge>
                    <Badge variant="outline">{c.formato}</Badge>
                    <Badge variant="outline" className="capitalize">{c.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Gancho: "<span className="text-foreground">{c.gancho}</span>"
              </div>
              {c.views !== undefined && (
                <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                  <Stat label="Views" value={c.views.toLocaleString("pt-BR")} />
                  <Stat label="Cliques" value={(c.cliques ?? 0).toLocaleString("pt-BR")} />
                  <Stat label="Vendas" value={(c.vendas ?? 0).toString()} />
                  <Stat label="Custo" value={brl(c.custo)} />
                </div>
              )}
            </CardContent>
          </Card>
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
