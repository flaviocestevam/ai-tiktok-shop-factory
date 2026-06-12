import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { perfis, clientes } from "@/lib/mock/data";
import { useCustos, usePerfis } from "@/integrations/supabase/hooks";
import { Wallet, Coins, ReceiptText, Percent, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/custos")({
  head: () => ({ meta: [{ title: "Custos — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

function Page() {
  const { data: custos, isLoading } = useCustos();
  const { data: perfis } = usePerfis();

  if (isLoading) {
    return (
      <PageShell title="Custos" description="Carregando custos...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const totals = {
    ia: custos?.filter(c => ["script_generation", "image_generation", "video_generation", "carousel_generation", "voice_generation"].includes(c.cost_type))
              .reduce((s, c) => s + (c.total_cost || 0), 0) || 0,
    storage: custos?.filter(c => c.cost_type === "storage").reduce((s, c) => s + (c.total_cost || 0), 0) || 0,
    outros: custos?.filter(c => !["storage", "script_generation", "image_generation", "video_generation", "carousel_generation", "voice_generation"].includes(c.cost_type))
                  .reduce((s, c) => s + (c.total_cost || 0), 0) || 0,
  };

  return (
    <PageShell title="Custos" description="Custo por foto, vídeo, carrossel, voz, render, storage, campanha, produto, avatar, perfil e cliente.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Custo IA" value={brl(totals.ia)} icon={Coins} tone="warning" />
        <MetricCard label="Storage" value={brl(totals.storage)} icon={Wallet} />
        <MetricCard label="Outros" value={brl(totals.outros)} icon={ReceiptText} />
        <MetricCard label="Total Operacional" value={brl(totals.ia + totals.storage + totals.outros)} icon={TrendingUp} tone="success" />
      </div>

      <Tabs defaultValue="perfil" className="mt-6">
        <TabsList>
          <TabsTrigger value="perfil">Por Perfil</TabsTrigger>
          <TabsTrigger value="geral">Dashboard Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle className="text-base">Custos por perfil próprio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {perfis?.map((p) => (
                <div key={p.id} className="rounded-md border border-border bg-card px-3 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{p.nome}</div>
                      <div className="text-xs text-muted-foreground">{p.nicho}</div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <Stat k="Custo Total" v={brl(p.custo_producao || 0)} tone="warning" />
                      <Stat k="Receita" v={brl(p.receita || 0)} tone="success" />
                      <Stat k="Lucro" v={brl((p.receita || 0) - (p.custo_producao || 0))} tone="success" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geral">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/70">
              <CardHeader><CardTitle className="text-base">Custos operacionais</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row k="Custo total com IA" v={brl(totals.ia)} />
                <Row k="Custo de storage" v={brl(totals.storage)} />
                <Row k="Outros custos" v={brl(totals.outros)} />
                <Row k="Custo total operacional" v={brl(totals.ia + totals.storage + totals.outros)} bold tone="warning" />
              </CardContent>
            </Card>
            <Card className="bg-card/70">
              <CardHeader><CardTitle className="text-base">Resumo financeiro</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground italic">Selecione uma aba para mais detalhes por categoria.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}


function Stat({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-card px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`text-sm font-semibold ${c}`}>{v}</div>
    </div>
  );
}

function Row({ k, v, bold, tone }: { k: string; v: string; bold?: boolean; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="flex justify-between px-3 py-2 rounded-md hover:bg-accent/40">
      <span className="text-muted-foreground">{k}</span>
      <span className={`${bold ? "font-bold" : ""} ${c}`}>{v}</span>
    </div>
  );
}
