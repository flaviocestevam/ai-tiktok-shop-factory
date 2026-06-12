import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clientes } from "@/lib/mock/data";

export const Route = createFileRoute("/entregas")({
  head: () => ({ meta: [{ title: "Entregas — Video Factory" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell title="Entregas" description="Status de entrega por cliente recorrente.">
      <Card className="bg-card/70">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Cliente</th>
                <th className="text-right p-3">Contratado</th>
                <th className="text-right p-3">Produzido</th>
                <th className="text-right p-3">Entregue</th>
                <th className="text-right p-3">Pendente</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => {
                const total = c.videosContratados + c.carrosseisContratados;
                const pend = c.criativosProduzidos - c.criativosEntregues;
                return (
                  <tr key={c.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="p-3 font-medium">{c.empresa}</td>
                    <td className="p-3 text-right">{total}</td>
                    <td className="p-3 text-right">{c.criativosProduzidos}</td>
                    <td className="p-3 text-right">{c.criativosEntregues}</td>
                    <td className="p-3 text-right">{pend}</td>
                    <td className="p-3">
                      <Badge className={pend === 0 ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"}>
                        {pend === 0 ? "completo" : "em andamento"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
