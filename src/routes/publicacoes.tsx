import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { publicacoes } from "@/lib/mock/data";

export const Route = createFileRoute("/publicacoes")({
  head: () => ({ meta: [{ title: "Publicações — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

function Page() {
  return (
    <PageShell title="Publicações" description="Cada publicação na conta do TikTok Shop, com métricas reais.">
      <Card className="bg-card/70">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Criativo</th>
                <th className="text-left p-3">Perfil</th>
                <th className="text-right p-3">Data</th>
                <th className="text-right p-3">Views</th>
                <th className="text-right p-3">Cliques</th>
                <th className="text-right p-3">Vendas</th>
                <th className="text-right p-3">Receita</th>
                <th className="text-right p-3">Vendas/1k</th>
              </tr>
            </thead>
            <tbody>
              {publicacoes.map((p) => (
                <tr key={p.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="p-3 font-medium">{p.criativo}</td>
                  <td className="p-3 text-muted-foreground">{p.perfil}</td>
                  <td className="p-3 text-right">{p.data}</td>
                  <td className="p-3 text-right">{fmt(p.views)}</td>
                  <td className="p-3 text-right">{fmt(p.cliques)}</td>
                  <td className="p-3 text-right">{fmt(p.vendas)}</td>
                  <td className="p-3 text-right text-success">{brl(p.receita)}</td>
                  <td className="p-3 text-right">{(p.vendas / (p.views / 1000)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
