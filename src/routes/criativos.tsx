import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { criativos } from "@/lib/mock/data";
import { carrosseis } from "@/lib/mock/extra";
import { PlayCircle, Images, Download, Copy, CheckCheck, Send, BarChart3, Eye } from "lucide-react";

export const Route = createFileRoute("/criativos")({
  head: () => ({ meta: [{ title: "Criativos Finais — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

type Item = {
  id: string; tipo: "vídeo" | "carrossel"; titulo: string; produto: string;
  avatar: string; formato: string; angulo?: string; gancho?: string;
  status: string; custo: number; views?: number; cliques?: number; vendas?: number;
  slides?: number; campanha?: string;
};

function buildItems(): Item[] {
  const vids: Item[] = criativos.map((c) => ({
    id: c.id, tipo: c.tipo, titulo: c.titulo, produto: c.produto,
    avatar: c.avatar, formato: c.formato, gancho: c.gancho,
    status: c.status, custo: c.custo, views: c.views, cliques: c.cliques, vendas: c.vendas,
  }));
  const carrs: Item[] = carrosseis.map((c) => ({
    id: c.id, tipo: "carrossel", titulo: c.titulo, produto: c.produto,
    avatar: c.avatar, formato: c.formato, angulo: c.angulo,
    status: c.status, custo: c.custo, views: c.views, cliques: c.cliques, vendas: c.vendas,
    slides: c.slides.length, campanha: c.campanha,
  }));
  // dedupe by id
  const map = new Map<string, Item>();
  [...vids, ...carrs].forEach((i) => map.set(i.id, i));
  return Array.from(map.values());
}

function Page() {
  const all = buildItems();
  const filt = {
    todos: all,
    videos: all.filter((c) => c.tipo === "vídeo"),
    carrosseis: all.filter((c) => c.tipo === "carrossel"),
    pendentes: all.filter((c) => c.status === "em produção" || c.status === "aprovação"),
    publicados: all.filter((c) => c.status === "publicado"),
    campeoes: all.filter((c) => (c.vendas ?? 0) >= 100),
    entregues: all.filter((c) => c.status === "aprovado" || c.status === "publicado"),
    erro: all.filter((c) => c.status === "rejeitado"),
  };

  return (
    <PageShell title="Criativos Finais" description="Todos os criativos aprovados, publicados, vencedores ou com erro.">
      <Tabs defaultValue="todos">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="todos">Todos ({filt.todos.length})</TabsTrigger>
          <TabsTrigger value="videos">Vídeos ({filt.videos.length})</TabsTrigger>
          <TabsTrigger value="carrosseis">Carrosséis ({filt.carrosseis.length})</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes ({filt.pendentes.length})</TabsTrigger>
          <TabsTrigger value="publicados">Publicados ({filt.publicados.length})</TabsTrigger>
          <TabsTrigger value="campeoes">Campeões ({filt.campeoes.length})</TabsTrigger>
          <TabsTrigger value="entregues">Entregues ({filt.entregues.length})</TabsTrigger>
          <TabsTrigger value="erro">Com erro ({filt.erro.length})</TabsTrigger>
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

function Grid({ items }: { items: Item[] }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">Nenhum criativo nessa categoria.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((c) => (
        <Card key={c.id} className="bg-card/70 hover:border-primary/40 transition">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-lg bg-muted grid place-items-center shrink-0">
                {c.tipo === "vídeo" ? <PlayCircle className="h-6 w-6 text-primary" /> : <Images className="h-6 w-6 text-primary" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{c.titulo}</div>
                <div className="text-xs text-muted-foreground truncate">{c.produto} • {c.avatar}</div>
                <div className="flex items-center gap-1.5 mt-2 text-xs flex-wrap">
                  <Badge variant="outline" className="capitalize">{c.tipo}</Badge>
                  <Badge variant="outline">{c.formato}</Badge>
                  <Badge variant="outline" className="capitalize">{c.status}</Badge>
                  {c.slides && <Badge variant="outline">{c.slides} slides</Badge>}
                </div>
              </div>
            </div>

            {c.gancho && (
              <div className="text-xs text-muted-foreground">
                Gancho: "<span className="text-foreground">{c.gancho}</span>"
              </div>
            )}
            {c.angulo && (
              <div className="text-xs text-muted-foreground">
                Ângulo: <span className="text-foreground">{c.angulo}</span>
              </div>
            )}

            {c.views !== undefined && (
              <div className="grid grid-cols-4 gap-2 text-xs">
                <Stat label="Views" value={c.views.toLocaleString("pt-BR")} />
                <Stat label="Cliques" value={(c.cliques ?? 0).toLocaleString("pt-BR")} />
                <Stat label="Vendas" value={(c.vendas ?? 0).toString()} />
                <Stat label="Custo" value={brl(c.custo)} />
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {c.tipo === "vídeo" ? (
                <>
                  <Btn icon={Eye}>Assistir</Btn>
                  <Btn icon={Download}>MP4</Btn>
                </>
              ) : (
                <>
                  <Btn icon={Download}>Imagens</Btn>
                  <Btn icon={Download}>ZIP</Btn>
                </>
              )}
              <Btn icon={Download}>Capa</Btn>
              <Btn icon={Copy}>Legenda</Btn>
              <Btn icon={CheckCheck}>Entregue</Btn>
              <Btn icon={Send}>Publicado</Btn>
              <Btn icon={BarChart3}>Analisar</Btn>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
function Btn({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <Button size="sm" variant="outline" className="h-7 gap-1 text-[11px] px-2">
      <Icon className="h-3 w-3" />{children}
    </Button>
  );
}
