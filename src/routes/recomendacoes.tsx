import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePerfis, useClientes, useAprendizados, useProdutos } from "@/integrations/supabase/hooks";
import { recomendacoesAcoes } from "@/lib/mock/financeiro";
import { useState } from "react";
import { Sparkles, Wand2, ArrowUpRight, ArrowDownRight, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({ meta: [{ title: "Recomendações sob demanda — Video Factory" }] }),
  component: Page,
});

function Page() {
  const { data: perfis, isLoading: loadingPerfis } = usePerfis();
  const { data: clientes, isLoading: loadingClientes } = useClientes();
  const { data: aprendizados, isLoading: loadingAprendizados } = useAprendizados();
  const { data: produtos } = useProdutos();
  const [analisando, setAnalisando] = useState<string | null>(null);

  if (loadingPerfis || loadingClientes || loadingAprendizados) {
    return (
      <PageShell title="Recomendações sob demanda" description="Carregando base de conhecimento...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const handleAnalisar = (acao: string) => {
    setAnalisando(acao);
    setTimeout(() => setAnalisando(null), 2000);
  };

  const ganchos = aprendizados?.filter(a => a.categoria === "gancho").sort((a, b) => (b.peso || 0) - (a.peso || 0)) || [];
  const avatares = aprendizados?.filter(a => a.categoria === "avatar").sort((a, b) => (b.peso || 0) - (a.peso || 0)) || [];
  const formatos = aprendizados?.filter(a => a.categoria === "formato").sort((a, b) => (b.peso || 0) - (a.peso || 0)) || [];
  const topProdutos = aprendizados?.filter(a => a.categoria === "produto").sort((a, b) => (b.peso || 0) - (a.peso || 0)) || [];

  return (
    <PageShell
      title="Recomendações sob demanda"
      description="Inteligência priorizada por ROI, custo por venda e saturação. A IA aprende com cada resultado real."
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              ROI Médio Sugerido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12.4x</div>
            <p className="text-xs text-muted-foreground mt-1">+15% vs. semana passada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Custo Médio/Venda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2,45</div>
            <p className="text-xs text-muted-foreground mt-1">-8% otimização por IA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Saturação Crítica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 itens</div>
            <p className="text-xs text-muted-foreground mt-1">Recomendado pausar/substituir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Novos Aprendizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aprendizados?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Base atualizada há 12min</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ganchos">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="ganchos" className="gap-2">Ganchos</TabsTrigger>
            <TabsTrigger value="avatares" className="gap-2">Avatares</TabsTrigger>
            <TabsTrigger value="formatos" className="gap-2">Formatos</TabsTrigger>
            <TabsTrigger value="produtos" className="gap-2">Produtos</TabsTrigger>
            <TabsTrigger value="analise" className="gap-2">Análise sob demanda</TabsTrigger>
          </TabsList>
          
          <Button variant="default" size="sm" className="gap-2" onClick={() => handleAnalisar("Geral")}>
            <Wand2 className="h-4 w-4" />
            {analisando ? "Processando..." : "Nova Análise Global"}
          </Button>
        </div>

        <TabsContent value="ganchos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ganchos.map((g) => (
              <RecommendationCard key={g.id} item={g} />
            ))}
            {ganchos.length === 0 && <EmptyState text="Nenhum gancho mapeado ainda." />}
          </div>
        </TabsContent>

        <TabsContent value="avatares">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avatares.map((a) => (
              <RecommendationCard key={a.id} item={a} />
            ))}
            {avatares.length === 0 && <EmptyState text="Nenhum avatar performando em destaque." />}
          </div>
        </TabsContent>

        <TabsContent value="formatos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formatos.map((f) => (
              <RecommendationCard key={f.id} item={f} />
            ))}
            {formatos.length === 0 && <EmptyState text="Nenhum formato preferencial identificado." />}
          </div>
        </TabsContent>

        <TabsContent value="produtos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProdutos.map((p) => (
              <RecommendationCard key={p.id} item={p} />
            ))}
            {topProdutos.length === 0 && <EmptyState text="Nenhuma recomendação de produto ativa." />}
          </div>
        </TabsContent>

        <TabsContent value="analise">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Solicitar Análise</CardTitle>
                <CardDescription>A IA cruzará custos, vendas e saturação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(["perfil", "campanha", "produto", "cliente"] as const).map((tipo) => (
                  <div key={tipo} className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">{tipo}</h4>
                    <div className="flex flex-wrap gap-2">
                      {recomendacoesAcoes[tipo].map((acao) => (
                        <Button
                          key={acao}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleAnalisar(acao)}
                          disabled={!!analisando}
                        >
                          <Wand2 className="h-3 w-3 mr-1" />
                          {analisando === acao ? "Analisando..." : acao}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Relatório de Inteligência</CardTitle>
                  </div>
                  <Badge variant="outline">Análise Finalizada</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Block 
                  k="Estratégia Vencedora" 
                  v="Ganchos de 'Curiosidade Imediata' + Avatar Marina (BR) em formato Carrossel de 7 slides." 
                  tone="success"
                />
                <Block 
                  k="Alerta de Saturação" 
                  v="O nicho de Casa Inteligente está com CTR em queda. Gancho 'Você nunca viu isso' perdeu 40% de eficiência." 
                  tone="warning"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Block k="Custo Projetado" v="R$ 1,20 / Criativo" />
                  <Block k="ROI Esperado" v="18.5x" tone="success" />
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Próximos Ganchos a Produzir:</h4>
                  <div className="space-y-2">
                    {[
                      "O segredo que as lojas não contam...",
                      "Parei de gastar dinheiro com X depois disso",
                      "3 motivos para você ter um Y em 2026"
                    ].map(g => (
                      <div key={g} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded border border-dashed">
                        <span>{g}</span>
                        <Badge variant="secondary" className="text-[10px]">Alta Prioridade</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function RecommendationCard({ item }: { item: any }) {
  const satValue = Math.floor(Math.random() * 100); // Mocked saturation
  const roi = (item.peso || 1) * 2.5;
  const isSaturated = satValue > 80;

  return (
    <Card className={`overflow-hidden border-l-4 ${isSaturated ? "border-l-warning" : "border-l-success"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-bold truncate max-w-[180px]">{item.titulo}</CardTitle>
          <Badge variant={isSaturated ? "warning" : "success"} className="text-[10px] px-1.5 py-0">
            {isSaturated ? "Saturado" : "Escalável"}
          </Badge>
        </div>
        <CardDescription className="text-xs line-clamp-2 h-8">{item.detalhe}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            ROI Proj. <ArrowUpRight className="h-3 w-3 text-success" />
          </span>
          <span className="font-bold text-success">{roi.toFixed(1)}x</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Saturação</span>
            <span>{satValue}%</span>
          </div>
          <Progress value={satValue} className={`h-1.5 ${isSaturated ? "bg-warning/20" : "bg-success/20"}`} />
        </div>

        <div className="pt-2 border-t flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground">
            Peso de IA: <span className="font-medium text-foreground">{item.peso || 1}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 gap-1">
            <TrendingUp className="h-3 w-3" />
            Priorizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Block({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "border-success/30 bg-success/5" : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-border bg-card";
  return (
    <div className={`rounded-md border ${c} px-3 py-2`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-sm mt-0.5 font-medium">{v}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="col-span-full h-32 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/30">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function RecommendationBlock({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" }) {
  return <Block k={k} v={v} tone={tone} />;
}

