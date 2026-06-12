import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { campanhasFull, formatosVideo, formatosCarrossel } from "@/lib/mock/extra";
import { ChevronLeft, Film, Images, Sparkles } from "lucide-react";

export const Route = createFileRoute("/campanhas/$id")({
  loader: ({ params }) => {
    const c = campanhasFull.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.c.nome ?? "Campanha"} — Video Factory` }] }),
  component: CampanhaDetail,
  notFoundComponent: () => <PageShell title="Campanha não encontrada"><p className="text-muted-foreground">—</p></PageShell>,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function CampanhaDetail() {
  const { c } = Route.useLoaderData();
  const fVideo = c.formatosVideo.map((s) => ({ ...s, def: formatosVideo.find((f) => f.id === s.id)! }));
  const fCarr = c.formatosCarrossel.map((s) => ({ ...s, def: formatosCarrossel.find((f) => f.id === s.id)! }));
  const totalFotos = c.fotos;
  const totalRoteiros = c.roteiros;

  return (
    <PageShell
      title={c.nome}
      description={`${c.tipo === "cliente" ? "Cliente" : "Uso próprio"} • ${c.perfilOuCliente} • ${c.produto}`}
      actions={<Button asChild variant="ghost" size="sm"><Link to="/campanhas"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Mini k="Status" v={c.status} />
        <Mini k="Caminho" v={c.caminho} />
        <Mini k="Objetivo" v={c.objetivo} />
        <Mini k="Avatar" v={c.avatar} />
        <Mini k="País / Nicho" v={`${c.pais} • ${c.nicho}`} />
        <Mini k="Início" v={c.inicio} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Recomendação de caminho</CardTitle>
            <CardDescription>Mix sugerido pelo motor com base no produto e histórico.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1"><span>Carrossel</span><span className="font-medium">{c.mixSugerido.carrosseis}%</span></div>
                <Progress value={c.mixSugerido.carrosseis} className="h-2" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1"><span>Vídeo</span><span className="font-medium">{c.mixSugerido.videos}%</span></div>
                <Progress value={c.mixSugerido.videos} className="h-2" />
              </div>
            </div>
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
              Caminho principal: <strong className="capitalize">{c.caminho}</strong>. Esse produto {c.mixSugerido.carrosseis >= 60 ? "não precisa de vídeo caro — carrossel com antes/depois deve ser suficiente." : "precisa de movimento real — priorizar vídeo."}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base">Financeiro</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <Box k="Custo estimado" v={brl(c.custoEstimado)} />
            <Box k="Custo real" v={brl(c.custoReal)} />
            <Box k="Receita" v={brl(c.receita)} tone="success" />
            <Box k="Lucro est." v={brl(c.lucroEstimado)} tone="success" />
            <Box k="ROI" v={`${c.roi.toFixed(1)}x`} tone="brand" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Film className="h-4 w-4 text-primary" />Formatos de vídeo selecionados</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {fVideo.length === 0 && <p className="text-xs text-muted-foreground">Nenhum vídeo planejado.</p>}
            {fVideo.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{f.def.nome}</div>
                  <div className="text-xs text-muted-foreground">{f.def.quandoUsar}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline">{f.quantidade}x</Badge>
                  <Badge variant="outline">ROI {f.def.roi.toFixed(1)}x</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Images className="h-4 w-4 text-primary" />Formatos de carrossel selecionados</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {fCarr.length === 0 && <p className="text-xs text-muted-foreground">Nenhum carrossel planejado.</p>}
            {fCarr.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{f.def.nome}</div>
                  <div className="text-xs text-muted-foreground">{f.def.slidesPadrao} slides padrão • {f.def.quandoUsar}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline">{f.quantidade}x</Badge>
                  <Badge variant="outline">ROI {f.def.roi.toFixed(1)}x</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader className="pb-2"><CardTitle className="text-base">Produção</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
          <Box k="Roteiros" v={String(totalRoteiros)} />
          <Box k="Fotos geradas" v={String(totalFotos)} />
          <Box k="Vídeos gerados" v={String(c.videosGerados)} />
          <Box k="Carrosséis gerados" v={String(c.carrosseisGerados)} />
          <Box k="Criativos finais" v={String(c.criativosFinais)} />
          <Box k="Entregas" v={String(c.entregas)} />
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-sm font-medium mt-0.5 capitalize">{v}</div>
    </div>
  );
}
function Box({ k, v, tone }: { k: string; v: string; tone?: "success" | "brand" }) {
  const t = tone === "success" ? "text-success" : tone === "brand" ? "text-gradient-brand" : "";
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`font-display font-semibold mt-0.5 ${t}`}>{v}</div>
    </div>
  );
}
