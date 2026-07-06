import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCriativos } from "@/integrations/supabase/hooks";
import { PlayCircle, Images, Download, Copy } from "lucide-react";

export const Route = createFileRoute("/criativos")({
  head: () => ({ meta: [{ title: "Criativos — Video Factory" }] }),
  component: Page,
});

function Page() {
  const { data: criativos = [], isLoading } = useCriativos();

  if (isLoading) {
    return (
      <PageShell title="Criativos" description="Carregando criativos...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const filt = {
    todos: criativos,
    videos: criativos.filter((c: any) => c.tipo === "vídeo" || c.tipo === "video"),
    carrosseis: criativos.filter((c: any) => c.tipo === "carrossel"),
    publicados: criativos.filter((c: any) => c.status === "publicado"),
    pendentes: criativos.filter((c: any) => c.status === "em produção"),
  };

  return (
    <PageShell title="Criativos" description="Vídeos e carrosséis produzidos pela fábrica.">
      <Tabs defaultValue="todos">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="todos">Todos ({filt.todos.length})</TabsTrigger>
          <TabsTrigger value="videos">Vídeos ({filt.videos.length})</TabsTrigger>
          <TabsTrigger value="carrosseis">Carrosséis ({filt.carrosseis.length})</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes ({filt.pendentes.length})</TabsTrigger>
          <TabsTrigger value="publicados">Publicados ({filt.publicados.length})</TabsTrigger>
        </TabsList>
        {(Object.keys(filt) as (keyof typeof filt)[]).map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <Grid items={filt[k]} />
          </TabsContent>
        ))}
      </Tabs>
    </PageShell>
  );
}

function Grid({ items }: { items: any[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum criativo nessa categoria.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((c) => (
        <Card key={c.id} className="bg-card/70 hover:border-primary/40 transition">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-lg bg-muted grid place-items-center shrink-0">
                {c.tipo === "carrossel" ? (
                  <Images className="h-6 w-6 text-primary" />
                ) : (
                  <PlayCircle className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{c.titulo || "Sem título"}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {c.produto?.nome || "—"} • {c.avatar?.nome || "—"}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs flex-wrap">
                  <Badge variant="outline" className="capitalize">{c.tipo}</Badge>
                  {c.formato && <Badge variant="outline">{c.formato}</Badge>}
                  <Badge variant="outline" className="capitalize">{c.status}</Badge>
                  {c.num_slides && <Badge variant="outline">{c.num_slides} slides</Badge>}
                </div>
              </div>
            </div>
            {c.gancho && (
              <div className="text-xs text-muted-foreground">
                Gancho: "<span className="text-foreground">{c.gancho}</span>"
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {c.arquivo_url && (
                <Button size="sm" variant="outline" className="h-7 gap-1 text-[11px] px-2" asChild>
                  <a href={c.arquivo_url} target="_blank" rel="noreferrer">
                    <Download className="h-3 w-3" /> Baixar
                  </a>
                </Button>
              )}
              {c.legenda && (
                <Button size="sm" variant="outline" className="h-7 gap-1 text-[11px] px-2"
                  onClick={() => navigator.clipboard.writeText(c.legenda)}>
                  <Copy className="h-3 w-3" /> Legenda
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
