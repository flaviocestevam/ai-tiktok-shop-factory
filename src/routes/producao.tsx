import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCriativos } from "@/integrations/supabase/hooks";
import { filaStatuses } from "@/lib/mock/financeiro";


export const Route = createFileRoute("/producao")({
  head: () => ({ meta: [{ title: "Fila de Produção — Video Factory" }] }),
  component: Page,
});

const columns = [
  { key: "em produção", label: "Em produção", group: ["roteiro em produção", "fotos em produção", "vídeos em geração", "carrosséis em geração", "edição automática"] },
  { key: "aprovação", label: "Aprovação", group: ["aguardando aprovação do produto", "roteiro aguardando aprovação", "fotos aguardando aprovação", "revisão interna"] },
  { key: "aprovado", label: "Aprovado / Entregue", group: ["aprovado", "entregue"] },
  { key: "publicado", label: "Publicado / Métricas", group: ["publicado", "aguardando métricas", "analisado"] },
] as const;

function Page() {
  const { data: criativos, isLoading } = useCriativos();
  
  // Simulate distribution of queue counts
  const counts: Record<string, number> = {};
  filaStatuses.forEach((s, i) => { counts[s] = (i * 3) % 7; });

  if (isLoading) {
    return (
      <PageShell title="Fila de Produção" description="Carregando fila...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }


  return (
    <PageShell
      title="Fila de Produção"
      description="Kanban com todos os status da fábrica, incluindo 'aguardando conta Gemini disponível'."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = criativos?.filter((c) => {
            if (col.key === "em produção") return (col.group as any).includes(c.status);
            if (col.key === "aprovação") return (col.group as any).includes(c.status);
            if (col.key === "aprovado") return (col.group as any).includes(c.status);
            if (col.key === "publicado") return (col.group as any).includes(c.status);
            return false;
          }) || [];


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
                    <div className="text-xs text-muted-foreground mt-1">{(c.produto as any)?.nome || "—"}</div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <Badge variant="outline" className="capitalize">{c.tipo}</Badge>
                      <span className="text-muted-foreground">{(c as any).avatar?.nome || "—"}</span>
                    </div>

                  </div>
                ))}
                <div className="pt-1 space-y-1">
                  {col.group.map((g) => (
                    <div key={g} className="flex justify-between text-[11px] text-muted-foreground px-1">
                      <span className="capitalize">{g}</span>
                      <span>{counts[g] ?? 0}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card/70 mt-4 border-warning/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">⚠️ Jobs aguardando conta Gemini disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            3 jobs pausados — sem perder roteiros, fotos ou campanhas. Continuarão automaticamente
            quando uma conta Gemini ficar disponível.
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
