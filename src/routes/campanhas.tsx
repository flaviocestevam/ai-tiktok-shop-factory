import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Building2, User } from "lucide-react";
import { campanhasFull } from "@/lib/mock/extra";

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
const caminhoColor: Record<string, string> = {
  "vídeos": "bg-info/15 text-info border-info/30",
  "carrosséis": "bg-primary/15 text-primary border-primary/30",
  "mista": "bg-warning/15 text-warning border-warning/30",
};

function Page() {
  return (
    <PageShell
      title="Campanhas"
      description="Uma campanha agrupa produto, avatar, formatos, roteiros e criativos. Pode ser uso próprio ou cliente."
      actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Nova campanha</Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="bg-card/70"><CardHeader className="pb-1"><CardDescription>Total ativas</CardDescription><CardTitle className="font-display text-3xl">{campanhasFull.length}</CardTitle></CardHeader></Card>
        <Card className="bg-card/70"><CardHeader className="pb-1"><CardDescription>Uso próprio</CardDescription><CardTitle className="font-display text-3xl">{campanhasFull.filter(c=>c.tipo==="uso próprio").length}</CardTitle></CardHeader></Card>
        <Card className="bg-card/70"><CardHeader className="pb-1"><CardDescription>Cliente</CardDescription><CardTitle className="font-display text-3xl">{campanhasFull.filter(c=>c.tipo==="cliente").length}</CardTitle></CardHeader></Card>
        <Card className="bg-card/70"><CardHeader className="pb-1"><CardDescription>Receita atribuída</CardDescription><CardTitle className="font-display text-3xl text-success">{brl(campanhasFull.reduce((s,c)=>s+c.receita,0))}</CardTitle></CardHeader></Card>
      </div>

      <Card className="bg-card/70">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Campanha</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Perfil / Cliente</th>
                <th className="text-left p-3">Produto</th>
                <th className="text-left p-3">Caminho</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Criativos</th>
                <th className="text-right p-3">Receita</th>
                <th className="text-right p-3">Custo</th>
                <th className="text-right p-3">ROI</th>
              </tr>
            </thead>
            <tbody>
              {campanhasFull.map((c) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-accent/40 cursor-pointer">
                  <td className="p-3 font-medium">
                    <Link to="/campanhas/$id" params={{ id: c.id }} className="hover:text-primary">{c.nome}</Link>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="gap-1">
                      {c.tipo === "cliente" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {c.tipo}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.perfilOuCliente}</td>
                  <td className="p-3">{c.produto}</td>
                  <td className="p-3"><Badge className={caminhoColor[c.caminho]}>{c.caminho}</Badge></td>
                  <td className="p-3"><Badge className={statusColor[c.status]}>{c.status}</Badge></td>
                  <td className="p-3 text-right">{c.criativosFinais}</td>
                  <td className="p-3 text-right text-success">{brl(c.receita)}</td>
                  <td className="p-3 text-right text-warning">{brl(c.custoReal)}</td>
                  <td className="p-3 text-right font-medium">{c.roi.toFixed(1)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
