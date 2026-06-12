import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { perfis, clientes } from "@/lib/mock/data";
import { recomendacoesAcoes } from "@/lib/mock/financeiro";
import { Sparkles, Wand2 } from "lucide-react";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({ meta: [{ title: "Recomendações sob demanda — Video Factory" }] }),
  component: Page,
});

const respostaIA = {
  funcionou: "Carrosséis de 5 imagens com gancho de descoberta + avatar Marina BR.",
  porque: "Reduzem custo de produção 3x e mantêm CVR acima da média do nicho.",
  naoFuncionou: "Vídeos longos (>30s) sem demonstração nos 2s iniciais.",
  repetir: "Mini seladora + Marina BR + carrossel antes/depois.",
  adaptar: "Trocar gancho do Organizador magnético — saturando.",
  parar: "Luminária dobrável — ROI negativo 3 campanhas seguidas.",
  custoRetorno: "Custo médio R$2,50/criativo → ROI projetado 22x.",
};

function Page() {
  return (
    <PageShell
      title="Recomendações sob demanda"
      description="A IA só é chamada quando você pede. Botões em perfil, campanha, produto e cliente."
    >
      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="campanha">Campanha</TabsTrigger>
          <TabsTrigger value="produto">Produto</TabsTrigger>
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
        </TabsList>

        {(["perfil", "campanha", "produto", "cliente"] as const).map((tipo) => (
          <TabsContent key={tipo} value={tipo}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-card/70 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base capitalize">Ações de IA — {tipo}</CardTitle>
                  <CardDescription>Clique para gerar análise sob demanda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recomendacoesAcoes[tipo].map((a) => (
                    <Button key={a} variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Wand2 className="h-3.5 w-3.5" />
                      {a}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card/70 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Última análise gerada</CardTitle>
                  </div>
                  <CardDescription>Resposta padrão da IA contém 11 blocos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Block k="O que funcionou" v={respostaIA.funcionou} tone="success" />
                  <Block k="Por que funcionou" v={respostaIA.porque} />
                  <Block k="O que não funcionou" v={respostaIA.naoFuncionou} tone="warning" />
                  <Block k="O que repetir" v={respostaIA.repetir} tone="success" />
                  <Block k="O que adaptar" v={respostaIA.adaptar} />
                  <Block k="O que parar" v={respostaIA.parar} tone="warning" />
                  <Block k="Custo × Retorno" v={respostaIA.custoRetorno} tone="success" />
                  <div className="pt-2 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground mr-2">Próximos criativos:</span>
                    <Badge variant="outline">Carrossel 5 img — antes/depois</Badge>
                    <Badge variant="outline">Vídeo 12s — gancho descoberta</Badge>
                    <Badge variant="outline">Review honesta — Marina</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {(tipo === "perfil" ? perfis : tipo === "cliente" ? clientes : perfis).slice(0, 3).map((item: any) => (
                <Card key={item.id} className="bg-card/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{item.nome || item.empresa}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Clique nos botões acima para analisar este {tipo} com IA.
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PageShell>
  );
}

function Block({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "border-success/30 bg-success/5" : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-border bg-card";
  return (
    <div className={`rounded-md border ${c} px-3 py-2`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-sm mt-0.5">{v}</div>
    </div>
  );
}
