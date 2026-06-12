import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/metric-card";
import { useGeminiAccounts } from "@/integrations/supabase/hooks";
import { ChevronLeft, Plus, KeyRound, Activity, AlertTriangle, Pause } from "lucide-react";

export const Route = createFileRoute("/configuracoes/gemini")({
  head: () => ({ meta: [{ title: "Contas Gemini — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const statusColor: Record<string, string> = {
  ativa: "bg-success/15 text-success border-success/30",
  reserva: "bg-primary/15 text-primary border-primary/30",
  pausada: "bg-muted text-muted-foreground",
  "sem crédito": "bg-destructive/15 text-destructive border-destructive/30",
  "limite diário": "bg-warning/15 text-warning border-warning/30",
  erro: "bg-destructive/15 text-destructive border-destructive/30",
  aguardando: "bg-muted text-muted-foreground",
};

function Page() {
  const { data: geminiAccounts, isLoading } = useGeminiAccounts();

  if (isLoading) {
    return (
      <PageShell title="Contas Gemini" description="Carregando contas...">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-24 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  const ativa = geminiAccounts?.find((g) => g.status === "ativa");
  const reserva = geminiAccounts?.find((g) => g.status === "reserva");
  const usoTotal = geminiAccounts?.reduce((s, g) => s + (g.uso_estimado || 0), 0) || 0;
  const orcamentoTotal = geminiAccounts?.reduce((s, g) => s + (g.orcamento || 0), 0) || 0;
  const restante = orcamentoTotal - usoTotal;

  return (
    <PageShell
      title="Contas Gemini"
      description="Gerenciador de contas com fallback automático por prioridade sequencial."
      actions={
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/configuracoes/provedores"><ChevronLeft className="h-4 w-4 mr-1" />Provedores</Link></Button>
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Adicionar conta</Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Conta em uso" value={ativa?.nome ?? "—"} icon={Activity} tone="success" />
        <MetricCard label="Próxima reserva" value={reserva?.nome ?? "—"} icon={KeyRound} />
        <MetricCard label="Uso estimado mês" value={brl(usoTotal)} icon={AlertTriangle} tone="warning" />
        <MetricCard label="Estimado restante" value={brl(restante)} icon={Pause} />
      </div>

      <div className="grid grid-cols-1 gap-3 mt-4">
        {geminiAccounts?.map((g) => {
          const pct = Math.round(((g.uso_estimado || 0) / (g.orcamento || 1)) * 100);
          return (
            <Card key={g.id} className="bg-card/70">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{g.nome}</CardTitle>
                      <Badge variant="outline">Prioridade {g.prioridade}</Badge>
                      <Badge className={statusColor[g.status]}>{g.status}</Badge>
                    </div>
                    <CardDescription className="mt-1">
                      <code className="text-xs">{g.api_key_masked}</code> · projeto <span className="font-mono">{g.gcp_project || "default"}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {g.usos?.map((u) => <Badge key={u} variant="outline" className="text-[10px]">{u}</Badge>)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Orçamento estimado {brl(g.orcamento || 0)}</span>
                    <span>Uso {brl(g.uso_estimado || 0)} ({pct}%)</span>
                  </div>
                  <Progress value={pct} className={pct >= (g.alerta_pct || 80) ? "[&>div]:bg-warning" : ""} />
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Alerta em {g.alerta_pct || 80}% · Pausar em 100% · Limite diário {brl(g.limite_diario || 0)}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <Mini k="Último uso" v={g.ultimo_uso ? new Date(g.ultimo_uso).toLocaleDateString() : "—"} />
                  <Mini k="Cadastrada" v={new Date(g.created_at).toLocaleDateString()} />
                  <Mini k="Restante" v={brl((g.orcamento || 0) - (g.uso_estimado || 0))} tone="success" />
                  <Mini k="Erros" v={g.ultimo_erro ?? "—"} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Pausar</Button>
                  <Button size="sm" variant="outline">Reativar</Button>
                  <Button size="sm" variant="outline">Editar limites</Button>
                  <Button size="sm" variant="outline">Trocar chave</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card/70 mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Modo de distribuição</CardTitle>
          <CardDescription>Modo 1 — Prioridade sequencial (Gemini 1 → 2 → 3 → 4 → 5)</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="rounded-md border border-border p-3">
            <strong>Fallback:</strong> Tentar Gemini Principal → se erro de limite/crédito, marcar como
            limitada e tentar próxima ativa por prioridade. Registrar qual conta gerou cada criativo.
          </div>
          <div className="rounded-md border border-warning/30 bg-warning/5 p-3">
            <strong>Se todas acabarem:</strong> pausar fila, marcar jobs como "aguardando conta Gemini disponível",
            alertar internamente, não apagar nada, continuar de onde parou quando nova conta for adicionada.
          </div>
          <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
            🔐 Chaves protegidas no backend. Frontend exibe apenas máscara (****8F3A).
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}


function Mini({ k, v, tone }: { k: string; v: string; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="rounded-md border border-border bg-card px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`text-sm font-semibold ${c}`}>{v}</div>
    </div>
  );
}
