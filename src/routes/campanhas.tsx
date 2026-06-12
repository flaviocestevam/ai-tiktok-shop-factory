import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { campanhas } from "@/lib/mock/data";

export const Route = createFileRoute("/campanhas")({
  head: () => ({ meta: [{ title: "Campanhas — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const statusColor: Record<string, string> = {
  "publicada": "bg-success/15 text-success border-success/30",
  "em produção": "bg-info/15 text-info border-info/30",
  "em revisão": "bg-warning/15 text-warning border-warning/30",
  "rascunho": "bg-muted text-muted-foreground border-border",
  "encerrada": "bg-muted text-muted-foreground border-border",
};

function Page() {
  return (
    <PageShell
      title="Campanhas"
      description="Cada campanha agrupa produto, avatar, ganchos e criativos."
      actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Nova campanha</Button>}
    >
      <Card className="bg-card/70">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Campanha</th>
                <th className="text-left p-3">Perfil / Cliente</th>
                <th className="text-left p-3">Produto</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Criativos</th>
                <th className="text-right p-3">Vendas</th>
                <th className="text-right p-3">Receita</th>
                <th className="text-right p-3">Custo</th>
              </tr>
            </thead>
            <tbody>
              {campanhas.map((c) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="p-3 font-medium">{c.nome}</td>
                  <td className="p-3 text-muted-foreground">{c.perfilOuCliente}</td>
                  <td className="p-3">{c.produto}</td>
                  <td className="p-3"><Badge className={statusColor[c.status]}>{c.status}</Badge></td>
                  <td className="p-3 text-right">{c.publicados}/{c.criativos}</td>
                  <td className="p-3 text-right">{c.vendas}</td>
                  <td className="p-3 text-right text-success">{brl(c.receita)}</td>
                  <td className="p-3 text-right text-warning">{brl(c.custo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
