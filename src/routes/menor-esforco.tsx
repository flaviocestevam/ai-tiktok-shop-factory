import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { criativos } from "@/lib/mock/data";
import { campanhasFull } from "@/lib/mock/extra";
import { Crown, Repeat } from "lucide-react";

export const Route = createFileRoute("/menor-esforco")({
  head: () => ({ meta: [{ title: "Menor Esforço, Maior Venda — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  const ranked = criativos.filter((c) => c.vendas && c.custo)
    .map((c) => ({ ...c, eficiencia: (c.vendas! / c.custo) }))
    .sort((a, b) => b.eficiencia - a.eficiencia);

  const campanhasEficientes = [...campanhasFull].filter(c => c.receita > 0)
    .sort((a, b) => (b.receita / Math.max(b.custoReal,1)) - (a.receita / Math.max(a.custoReal,1)));

  return (
    <PageShell
      title="Menor Esforço, Maior Venda"
      description="Qual produto vendeu com menos criativos, qual formato deu menor custo por venda, qual campanha repetir."
    >
      <Card className="bg-card/70 border-success/40 mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Crown className="h-4 w-4 text-success" />Produto campeão eficiente</CardTitle>
          <CardDescription>Vendeu muito com pouquíssimos criativos.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-3 text-sm">
          <div className="lg:col-span-2">
            <div className="font-display text-2xl font-semibold">Mini seladora portátil</div>
            <div className="text-xs text-muted-foreground mt-1">Casa Inteligente • Cozinha</div>
            <div className="mt-3 text-xs text-muted-foreground">Com apenas 4 criativos publicados: <span className="text-foreground">2 carrosséis</span> + <span className="text-foreground">2 vídeos</span></div>
          </div>
          <Stat k="Vendas" v="62" tone="success" />
          <Stat k="Custo total" v="R$22" tone="warning" />
          <Stat k="Custo/venda" v="R$0,35" tone="brand" />
          <div className="lg:col-span-4 mt-2 rounded-md border border-primary/30 bg-primary/5 p-3 flex items-center justify-between">
            <div className="text-sm">Ação recomendada: produzir mais <strong>8 carrosséis</strong> e <strong>4 vídeos</strong> com mesmo avatar e gancho.</div>
            <Button size="sm" className="gap-1.5"><Repeat className="h-4 w-4" />Repetir campanha</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card/70">
          <CardHeader><CardTitle className="text-base">Top criativos por eficiência</CardTitle><CardDescription>Vendas por real gasto.</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {ranked.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 grid place-items-center rounded-md bg-[var(--gradient-brand)] text-primary-foreground font-display font-bold">{i + 1}</div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.titulo}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.produto} • {c.avatar}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs shrink-0">
                  <Badge variant="outline">{c.vendas} v.</Badge>
                  <Badge variant="outline">{brl(c.custo)}</Badge>
                  <Badge className="bg-success/15 text-success border-success/30">{c.eficiencia.toFixed(1)} v/R$</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader><CardTitle className="text-base">Campanhas para repetir</CardTitle><CardDescription>Maior ROI por real investido.</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {campanhasEficientes.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.nome}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.perfilOuCliente} • {c.caminho}</div>
                </div>
                <div className="flex items-center gap-2 text-xs shrink-0">
                  <Badge variant="outline">{c.criativosFinais} cri.</Badge>
                  <Badge variant="outline">{brl(c.custoReal)}</Badge>
                  <Badge className="bg-success/15 text-success border-success/30">{c.roi.toFixed(1)}x ROI</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" | "brand" }) {
  const t = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "brand" ? "text-gradient-brand" : "";
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`font-display font-semibold text-xl ${t}`}>{v}</div>
    </div>
  );
}
