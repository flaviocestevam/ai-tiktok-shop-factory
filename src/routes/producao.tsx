import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { criativos } from "@/lib/mock/data";

export const Route = createFileRoute("/producao")({
  head: () => ({ meta: [{ title: "Produção — Video Factory" }] }),
  component: Page,
});

const columns = [
  { key: "em produção", label: "Em produção" },
  { key: "aprovação", label: "Aprovação" },
  { key: "aprovado", label: "Aprovado" },
  { key: "publicado", label: "Publicado" },
] as const;

function Page() {
  return (
    <PageShell
      title="Produção"
      description="Pipeline kanban da fábrica."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = criativos.filter((c) => c.status === col.key);
          return (
            <Card key={col.key} className="bg-card/50">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">{col.label}</CardTitle>
                <Badge variant="outline">{items.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border bg-card p-3 hover:border-primary/40 transition">
                    <div className="font-medium text-sm">{c.titulo}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.produto}</div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <Badge variant="outline" className="capitalize">{c.tipo}</Badge>
                      <span className="text-muted-foreground">{c.avatar}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-xs text-muted-foreground text-center py-6">Vazio</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
