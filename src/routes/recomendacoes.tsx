import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { perfis } from "@/lib/mock/data";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({ meta: [{ title: "Recomendações — Video Factory" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell title="Recomendações" description="Sugestões automáticas do que produzir a seguir.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {perfis.map((p) => (
          <Card key={p.id} className="bg-card/70">
            <CardHeader className="pb-2"><CardTitle className="text-base">{p.nome}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-[10px] uppercase tracking-wider text-success">Repetir</div>
              {p.recomendacoes.repetir.map((r: string, i: number) => (
                <div key={i} className="rounded-md border border-success/20 bg-success/5 px-3 py-2">{r}</div>
              ))}
              <div className="text-[10px] uppercase tracking-wider text-warning mt-3">Evitar</div>
              {p.recomendacoes.evitar.map((r: string, i: number) => (
                <div key={i} className="rounded-md border border-warning/20 bg-warning/5 px-3 py-2">{r}</div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
