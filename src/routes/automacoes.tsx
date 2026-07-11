import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAutomacoes, useToggleAutomacao } from "@/integrations/supabase/hooks";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/automacoes")({
  head: () => ({ meta: [{ title: "Automações — Video Factory" }] }),
  component: Page,
});

function Page() {
  const { data: automacoes, isLoading } = useAutomacoes();
  const toggle = useToggleAutomacao();

  if (isLoading) {
    return (
      <PageShell title="Automações" description="Carregando automações...">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Automações"
      description="Gatilhos internos que conectam aprovações, geração, métricas e aprendizado."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {automacoes?.map((a: any) => (
          <Card key={a.id} className="bg-card/70">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <CardDescription>Quando</CardDescription>
                    <CardTitle className="text-sm">{a.trigger}</CardTitle>
                  </div>
                </div>
                <Switch
                  checked={a.ativo}
                  disabled={toggle.isPending}
                  onCheckedChange={async (v) => {
                    try {
                      await toggle.mutateAsync({ id: a.id, ativo: v });
                    } catch (e: any) {
                      toast.error(e?.message ?? "Falha ao atualizar automação.");
                    }
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">→ {a.acao}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
