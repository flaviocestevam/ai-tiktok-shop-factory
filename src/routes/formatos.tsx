import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatosVideo, formatosCarrossel, angulosVendedores, eficienciaComercial, type RecomendacaoNivel } from "@/lib/mock/extra";

export const Route = createFileRoute("/formatos")({
  head: () => ({ meta: [{ title: "Biblioteca de Formatos — Video Factory" }] }),
  component: Page,
});

const recColor: Record<RecomendacaoNivel, string> = {
  "Alta": "bg-success/15 text-success border-success/30",
  "Média": "bg-info/15 text-info border-info/30",
  "Baixa": "bg-warning/15 text-warning border-warning/30",
  "Evitar": "bg-destructive/15 text-destructive border-destructive/30",
};

function Page() {
  return (
    <PageShell title="Biblioteca de Formatos" description="Formatos de vídeo, carrossel e ângulos vendedores com performance histórica.">
      <Tabs defaultValue="video">
        <TabsList>
          <TabsTrigger value="video">Vídeo ({formatosVideo.length})</TabsTrigger>
          <TabsTrigger value="carrossel">Carrossel ({formatosCarrossel.length})</TabsTrigger>
          <TabsTrigger value="angulos">Ângulos vendedores ({angulosVendedores.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="mt-4">
          <Grid items={formatosVideo} />
        </TabsContent>
        <TabsContent value="carrossel" className="mt-4">
          <Grid items={formatosCarrossel} carrossel />
        </TabsContent>
        <TabsContent value="angulos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {angulosVendedores.map((a) => (
              <Card key={a.id} className="bg-card/70">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{a.nome}</CardTitle></CardHeader>
                <CardContent className="text-xs text-muted-foreground">{a.descricao}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function Grid({ items, carrossel }: { items: any[]; carrossel?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((f) => {
        const ef = eficienciaComercial(f);
        return (
          <Card key={f.id} className="bg-card/70">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">{f.nome}</CardTitle>
                  <CardDescription className="text-xs mt-1">{f.descricao}</CardDescription>
                </div>
                <Badge className={recColor[f.recomendacao as RecomendacaoNivel]}>{f.recomendacao}</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="text-muted-foreground">Quando usar: <span className="text-foreground">{f.quandoUsar}</span></div>
              <div className="grid grid-cols-3 gap-2">
                <Stat k="Custo médio" v={`R$${f.custoMedio}`} />
                <Stat k="Conv. hist." v={`${f.conversaoHistorica}%`} />
                <Stat k="Vendas/cri." v={String(f.vendasPorCriativo)} />
                <Stat k="ROI" v={`${f.roi.toFixed(1)}x`} />
                <Stat k="Eficiência" v={String(ef)} highlight />
                {carrossel && <Stat k="Slides" v={String(f.slidesPadrao)} />}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function Stat({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className={`rounded-md border p-2 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background/40"}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`font-medium ${highlight ? "text-primary" : ""}`}>{v}</div>
    </div>
  );
}
