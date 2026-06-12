import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { criativos } from "@/lib/mock/data";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/aprovacoes")({
  head: () => ({ meta: [{ title: "Aprovações Internas — Video Factory" }] }),
  component: Page,
});

function Page() {
  const pendentes = criativos.filter((c) => c.status === "aprovação");
  return (
    <PageShell
      title="Aprovações Internas"
      description="Criativos aguardando revisão da equipe antes da entrega ou publicação."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pendentes.map((c) => (
          <Card key={c.id} className="bg-card/70">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-semibold">{c.titulo}</div>
                  <div className="text-xs text-muted-foreground">{c.produto} • {c.avatar}</div>
                </div>
                <Badge variant="outline" className="capitalize">{c.tipo}</Badge>
              </div>
              <p className="text-sm mt-3">Gancho: "<span className="text-primary">{c.gancho}</span>"</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="gap-1.5"><Check className="h-4 w-4" />Aprovar</Button>
                <Button size="sm" variant="outline" className="gap-1.5"><X className="h-4 w-4" />Reprovar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pendentes.length === 0 && <p className="text-muted-foreground">Nada aguardando aprovação.</p>}
      </div>
    </PageShell>
  );
}
