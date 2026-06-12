import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAprendizados } from "@/integrations/supabase/hooks";
import { classificacoes, saturacaoSinais, produtosIrmaos } from "@/lib/mock/financeiro";

import { Brain, TrendingUp, Layers, AlertTriangle, Recycle, ShieldAlert, Sparkles } from "lucide-react";

export const Route = createFileRoute("/inteligencia")({
  head: () => ({ meta: [{ title: "Inteligência da Fábrica — Video Factory" }] }),
  component: Page,
});

const aprendizados = {
  produtosBons: ["Mini seladora", "Organizador magnético", "Suporte de celular dobrável"],
  produtosRuins: ["Luminária dobrável", "Mini aspirador USB"],
  menorCusto: ["Mini seladora (R$0,35/venda)", "Organizador magnético (R$0,68/venda)"],
  menosCriativos: ["Mini seladora — 4 criativos, 62 vendas"],
  nichosBons: ["Casa Inteligente", "Pet Achadinhos"],
  nichosRuins: ["Eletrônicos genéricos"],
  formatosVencedores: ["Carrossel 5 imagens", "Antes/Depois 7 imagens"],
  formatosViewSemVenda: ["Vídeo viral 45s sem CTA claro"],
  avataresBons: ["Marina BR — 3 nichos, ROI 25x+"],
  ganchosBons: ["Eu não sabia que precisava disso", "Pare de comprar X antes de ver isso"],
  ctasBons: ["Compre antes de acabar o cupom", "Toque no carrinho amarelo"],
  combosBons: ["Mini seladora + Marina BR + Carrossel + Antes/Depois"],
  errosEvitar: ["Vídeo >30s sem demonstração nos 2s iniciais", "Carrossel sem preço visível"],
};

function Page() {
  const { data: aprendizadosReal, isLoading } = useAprendizados();

  if (isLoading) {
    return (
      <PageShell title="Inteligência da Fábrica" description="Carregando aprendizados...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  // Combine mock and real for presentation if real is empty
  const hasReal = aprendizadosReal && aprendizadosReal.length > 0;
  
  const displayAprendizados = {
    produtosBons: hasReal ? aprendizadosReal.filter(a => a.categoria === 'produto' && a.peso && a.peso > 0).map(a => a.titulo) : aprendizados.produtosBons,
    produtosRuins: hasReal ? aprendizadosReal.filter(a => a.categoria === 'produto' && a.peso && a.peso < 0).map(a => a.titulo) : aprendizados.produtosRuins,
    menorCusto: aprendizados.menorCusto,
    menosCriativos: aprendizados.menosCriativos,
    nichosBons: hasReal ? aprendizadosReal.filter(a => a.categoria === 'nicho' && a.peso && a.peso > 0).map(a => a.titulo) : aprendizados.nichosBons,
    nichosRuins: hasReal ? aprendizadosReal.filter(a => a.categoria === 'nicho' && a.peso && a.peso < 0).map(a => a.titulo) : aprendizados.nichosRuins,
    formatosVencedores: hasReal ? aprendizadosReal.filter(a => a.categoria === 'formato' && a.peso && a.peso > 0).map(a => a.titulo) : aprendizados.formatosVencedores,
    formatosViewSemVenda: aprendizados.formatosViewSemVenda,
    avataresBons: hasReal ? aprendizadosReal.filter(a => a.categoria === 'avatar' && a.peso && a.peso > 0).map(a => a.titulo) : aprendizados.avataresBons,
    ganchosBons: hasReal ? aprendizadosReal.filter(a => a.categoria === 'gancho' && a.peso && a.peso > 0).map(a => a.titulo) : aprendizados.ganchosBons,
    ctasBons: hasReal ? aprendizadosReal.filter(a => a.categoria === 'cta' && a.peso && a.peso > 0).map(a => a.titulo) : aprendizados.ctasBons,
    combosBons: aprendizados.combosBons,
    errosEvitar: hasReal ? aprendizadosReal.filter(a => a.peso && a.peso < 0).map(a => a.titulo) : aprendizados.errosEvitar,
  };


  return (
    <PageShell
      title="Inteligência da Fábrica"
      description="Base de conhecimento alimentada por resultados reais via API."
    >
      <Tabs defaultValue="aprendizados">
        <TabsList>
          <TabsTrigger value="aprendizados">Aprendizados</TabsTrigger>
          <TabsTrigger value="classificacoes">Classificação Comercial</TabsTrigger>
          <TabsTrigger value="reaproveitamento">Reaproveitamento</TabsTrigger>
          <TabsTrigger value="erros">Não repetir erro</TabsTrigger>
          <TabsTrigger value="saturacao">Saturação</TabsTrigger>
          <TabsTrigger value="irmaos">Produtos Irmãos</TabsTrigger>
        </TabsList>

        <TabsContent value="aprendizados">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KCard icon={TrendingUp} title="Produtos que funcionaram" items={displayAprendizados.produtosBons} tone="success" />
            <KCard icon={AlertTriangle} title="Produtos que não funcionaram" items={displayAprendizados.produtosRuins} tone="warning" />
            <KCard icon={Sparkles} title="Vendas com menor custo" items={displayAprendizados.menorCusto} tone="success" />
            <KCard icon={Sparkles} title="Vendas com menos criativos" items={displayAprendizados.menosCriativos} tone="success" />
            <KCard icon={Layers} title="Formatos vencedores" items={displayAprendizados.formatosVencedores} tone="success" />
            <KCard icon={Layers} title="View bait — sem venda" items={displayAprendizados.formatosViewSemVenda} tone="warning" />
            <KCard icon={Brain} title="Avatares vencedores" items={displayAprendizados.avataresBons} tone="success" />
            <KCard icon={Brain} title="Ganchos vencedores" items={displayAprendizados.ganchosBons} tone="success" />
            <KCard icon={Brain} title="CTAs vencedores" items={displayAprendizados.ctasBons} tone="success" />
            <KCard icon={Sparkles} title="Melhores combinações" items={displayAprendizados.combosBons} tone="success" />
            <KCard icon={AlertTriangle} title="Erros a evitar" items={displayAprendizados.errosEvitar} tone="warning" />
            <KCard icon={TrendingUp} title="Nichos bons / ruins" items={[...displayAprendizados.nichosBons.map((n) => `✓ ${n}`), ...displayAprendizados.nichosRuins.map((n) => `✗ ${n}`)]} />

          </div>
        </TabsContent>

        <TabsContent value="classificacoes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {classificacoes.map((c) => (
              <Card key={c.tipo} className={`bg-card/70 border-${c.cor}/30`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{c.tipo}</CardTitle>
                    <Badge className={`bg-${c.cor}/15 text-${c.cor} border-${c.cor}/30`}>ação</Badge>
                  </div>
                  <CardDescription>{c.desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm font-medium">{c.acao}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reaproveitamento">
          <Card className="bg-card/70">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Quando um criativo funciona</CardTitle>
              </div>
              <CardDescription>Sugerir variações automaticamente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {["3 novos ganchos", "2 carrosséis", "1 review honesta", "1 antes/depois", "1 comparação", "1 com objeção", "1 com outro avatar", "1 versão curta 9s"].map((s) => (
                  <div key={s} className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">{s}</div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-md border border-success/20 bg-success/5 p-3 text-sm">
                  <strong>Vídeo vendeu bem →</strong> transformar em carrossel
                </div>
                <div className="rounded-md border border-success/20 bg-success/5 p-3 text-sm">
                  <strong>Carrossel vendeu bem →</strong> transformar em vídeo
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erros">
          <Card className="bg-card/70">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-warning" />
                <CardTitle className="text-base">Motor de não repetir erro</CardTitle>
              </div>
              <CardDescription>Antes de criar, o sistema valida histórico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                "Esse formato já falhou 3x nesse nicho?",
                "Esse avatar já converteu mal nesse produto?",
                "Esse gancho já teve clique baixo?",
                "Esse tipo de criativo teve custo alto?",
                "Esse produto teve muitas views e poucas vendas?",
                "Esse produto teve muitos cliques e poucas vendas?",
                "Esse formato gerou ROI negativo?",
              ].map((q) => (
                <div key={q} className="flex justify-between rounded-md border border-border px-3 py-2">
                  <span>{q}</span>
                  <Badge variant="outline">Verificação automática</Badge>
                </div>
              ))}
              <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive font-medium">
                ⛔ Exemplo de alerta: "Não recomendado. Histórico ruim nesse nicho."
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saturacao">
          <Card className="bg-card/70">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="text-base">Detector de Saturação</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Sinais monitorados</div>
                <div className="grid grid-cols-2 gap-2">
                  {saturacaoSinais.map((s) => (
                    <div key={s} className="rounded-md border border-warning/20 bg-warning/5 px-3 py-2">{s}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 mt-3">Ações sugeridas</div>
                <div className="flex flex-wrap gap-2">
                  {["Trocar ângulo", "Trocar avatar", "Criar oferta nova", "Pausar por alguns dias", "Testar produto parecido", "Vídeo → carrossel", "Carrossel → vídeo", "Criar novo gancho"].map((a) => (
                    <Badge key={a} variant="outline">{a}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="irmaos">
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle className="text-base">Ranking de produtos irmãos</CardTitle>
              <CardDescription>Quando um produto funciona, sugerir similares por nicho, dor, categoria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(produtosIrmaos).map(([base, irmaos]) => (
                <div key={base} className="rounded-md border border-border bg-card p-3">
                  <div className="text-sm font-semibold mb-2">{base}</div>
                  <div className="flex flex-wrap gap-2">
                    {irmaos.map((i) => (
                      <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="mt-3">Gerar campanhas para irmãos</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function KCard({ icon: Icon, title, items, tone }: { icon: typeof Brain; title: string; items: string[]; tone?: "success" | "warning" }) {
  return (
    <Card className="bg-card/70">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg grid place-items-center ${tone === "success" ? "bg-success/10 text-success" : tone === "warning" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.map((it) => (
          <div key={it} className="text-xs rounded-md border border-border bg-card px-2.5 py-1.5">{it}</div>
        ))}
      </CardContent>
    </Card>
  );
}
