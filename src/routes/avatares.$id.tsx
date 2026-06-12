import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { avatares } from "@/lib/mock/data";
import { ChevronLeft, Camera, Upload, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/metric-card";

export const Route = createFileRoute("/avatares/$id")({
  loader: ({ params }) => {
    const a = avatares.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return { a };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.a.nome ?? "Avatar"} — Video Factory` }] }),
  component: AvatarDetail,
  notFoundComponent: () => (
    <PageShell title="Avatar não encontrado"><p className="text-muted-foreground">Esse avatar não existe.</p></PageShell>
  ),
});

const canonPack = [
  "Rosto frontal", "Rosto 45° esquerda", "Rosto 45° direita",
  "Meio corpo frontal", "Corpo inteiro",
  "Perfil lateral", "Sorrindo", "Ambiente real",
];

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function AvatarDetail() {
  const { a } = Route.useLoaderData();
  return (
    <PageShell
      title={a.nome}
      description={a.descricao}
      actions={
        <>
          <Button asChild variant="ghost" size="sm"><Link to="/avatares"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>
          <Button size="sm" className="gap-1.5"><Sparkles className="h-4 w-4" />Gerar avatar com IA</Button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {a.nichos.map((n: string) => <Badge key={n} variant="outline">{n}</Badge>)}
        {a.idiomas.map((i: string) => <Badge key={i} variant="outline">{i}</Badge>)}
        <Badge variant="outline" className="capitalize">{a.tipo}</Badge>
        <Badge className={a.status === "ativo" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>{a.status}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="ROI" value={`${a.roi.toFixed(1)}x`} tone="success" />
        <MetricCard label="Custo médio" value={brl(a.custoMedio)} />
        <MetricCard label="Custo por venda" value={brl(a.custoPorVenda)} tone="warning" />
        <MetricCard label="Vendas atribuídas" value={a.vendasAtribuidas.toLocaleString("pt-BR")} tone="brand" />
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><Camera className="h-4 w-4" />Fotos canônicas</CardTitle>
            <CardDescription>
              {a.fotosCanonicas}/{canonPack.length} fotos cadastradas — mínimo 1, recomendado 5, avançado 8.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5"><Upload className="h-4 w-4" />Upload</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {canonPack.map((slot, i) => {
              const filled = i < a.fotosCanonicas;
              return (
                <div key={slot} className={`aspect-[3/4] rounded-lg border ${filled ? "border-primary/30 bg-primary/5" : "border-dashed border-border bg-background/30"} grid place-items-center text-center p-3`}>
                  {filled ? (
                    <div className="text-xs">
                      <div className="h-10 w-10 rounded-full bg-[var(--gradient-brand)] mx-auto grid place-items-center text-primary-foreground font-display font-bold">
                        {a.nome[0]}
                      </div>
                      <div className="mt-2 text-muted-foreground">{slot}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      <Camera className="h-5 w-5 mx-auto opacity-50" />
                      <div className="mt-2">{slot}</div>
                      <div className="text-[10px] uppercase tracking-wider mt-1">vazio</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Info title="Estilos" items={a.estilos} />
        <Info title="Cenários" items={a.cenarios} />
        <Info title="Formatos" items={a.formatos} />
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader className="pb-2"><CardTitle className="text-base">Restrições</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">{a.restricoes}</CardContent>
      </Card>
    </PageShell>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="bg-card/70">
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {items.map((i: string) => <Badge key={i} variant="outline" className="capitalize">{i}</Badge>)}
      </CardContent>
    </Card>
  );
}
