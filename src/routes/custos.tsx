import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustos, useReferencias } from "@/integrations/supabase/hooks";
import { Coins, Wallet, ReceiptText, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/custos")({
  head: () => ({ meta: [{ title: "Custos — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

function Page() {
  const { data: custos = [], isLoading } = useCustos();
  const { data: referencias = [] } = useReferencias();

  if (isLoading) {
    return (
      <PageShell title="Custos" description="Carregando custos...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const totalCustos = custos.reduce((s, c: any) => s + Number(c.total_cost || 0), 0);
  const ia = custos
    .filter((c: any) =>
      ["script_generation", "image_generation", "video_generation", "carousel_generation", "voice_generation"].includes(c.cost_type),
    )
    .reduce((s, c: any) => s + Number(c.total_cost || 0), 0);
  const storage = custos
    .filter((c: any) => c.cost_type === "storage")
    .reduce((s, c: any) => s + Number(c.total_cost || 0), 0);

  const producao = referencias.length * 45; // custo estimado por criativo produzido

  return (
    <PageShell title="Custos" description="Custo de IA, produção e storage.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Custo IA" value={brl(ia)} icon={Coins} tone="warning" />
        <MetricCard label="Storage" value={brl(storage)} icon={Wallet} />
        <MetricCard label="Produção estimada" value={brl(producao)} icon={ReceiptText} />
        <MetricCard label="Total" value={brl(totalCustos + producao)} icon={TrendingUp} tone="success" />
      </div>

      <Card className="bg-card/70 mt-6">
        <CardHeader>
          <CardTitle className="text-base">Últimos custos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Tipo</th>
                <th className="text-right p-3">Quantidade</th>
                <th className="text-right p-3">Custo total</th>
                <th className="text-left p-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {custos.map((c: any) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="p-3">{c.cost_type}</td>
                  <td className="p-3 text-right">{c.quantity || 0}</td>
                  <td className="p-3 text-right">{brl(Number(c.total_cost || 0))}</td>
                  <td className="p-3 text-muted-foreground">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "—"}
                  </td>
                </tr>
              ))}
              {custos.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Nenhum custo registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
