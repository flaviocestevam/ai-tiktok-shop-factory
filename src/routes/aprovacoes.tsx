import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { criativos } from "@/lib/mock/data";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/aprovacoes")({
  head: () => ({ meta: [{ title: "Aprovações Internas — Video Factory" }] }),
  component: Page,
});

const fluxoPerfil = ["Produto", "Plano de campanha", "Roteiro", "Fotos base", "Criativo final"];
const fluxoCliente = ["Produto recebido", "Avatar escolhido", "Plano de vídeos/carrosséis", "Roteiros", "Criativos finais"];

function Page() {
  const pendentes = criativos.filter((c) => c.status === "aprovação");

  return (
    <PageShell
      title="Aprovações Internas"
      description="Fluxos de aprovação interna — clientes não acessam a plataforma."
    >
      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
          <TabsTrigger value="perfil">Fluxo — Perfis Próprios</TabsTrigger>
          <TabsTrigger value="cliente">Fluxo — Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendentes.map((c) => (
              <Card key={c.id} className="bg-card/70">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-lg font-semibold">{c.titulo}</div>
                      <div className="text-xs text-muted-foreground">{c.produto} • {c.avatar}</div>
                    </div>
                    <Badge variant="outline" className="capitalize">{c.tipo}</Badge>
                  </div>
                  <p className="text-sm mt-3">Gancho: "<span className="text-primary">{c.gancho}</span>"</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="gap-1.5"><Check className="h-4 w-4" />Aprovar</Button>
                    <Button size="sm" variant="outline" className="gap-1.5"><X className="h-4 w-4" />Reprovar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendentes.length === 0 && <p className="text-muted-foreground">Nada aguardando aprovação.</p>}
          </div>
        </TabsContent>

        <TabsContent value="perfil">
          <FluxoCard title="Etapas de aprovação — perfis próprios" items={fluxoPerfil} />
        </TabsContent>

        <TabsContent value="cliente">
          <FluxoCard title="Etapas de aprovação — clientes" items={fluxoCliente} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function FluxoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="bg-card/70">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Equipe interna aprova cada etapa antes de avançar.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          {items.map((it, i) => (
            <div key={it} className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary border-primary/30">{i + 1}. {it}</Badge>
              {i < items.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
