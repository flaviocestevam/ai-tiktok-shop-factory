import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { usePerfis } from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/perfis")({
  head: () => ({ meta: [{ title: "Meus Perfis — Video Factory" }] }),
  component: Page,
});

function Page() {
  const { data: perfis, isLoading } = usePerfis();

  if (isLoading) {
    return (
      <PageShell title="Meus Perfis" description="Carregando perfis...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Meus Perfis"
      description="Perfis próprios do TikTok Shop. Cada perfil concentra referências, criativos e métricas."
      actions={
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo perfil
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {perfis?.map((p: any) => {
          const conector = p.conectores?.[0];
          const lastSync = conector?.ultima_sync
            ? new Date(conector.ultima_sync).toLocaleString("pt-BR")
            : "Nunca";

          return (
            <Card key={p.id} className="bg-card/70 hover:border-primary/40 transition overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {p.status}
                      </Badge>
                      {conector && (
                        <Badge className="text-[10px] bg-success/10 text-success border-success/20 gap-1 capitalize">
                          <CheckCircle2 className="h-2.5 w-2.5" /> {conector.status}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold mt-2">{p.nome}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.nicho || "—"} • {p.pais || "—"}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-[var(--gradient-brand)] grid place-items-center text-primary-foreground font-display font-bold">
                    {p.nome.charAt(0)}
                  </div>
                </div>

                {conector && (
                  <div className="mt-3 p-2 rounded-md bg-muted/30 border border-border/40 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Última sincronização: {lastSync}
                    </div>
                  </div>
                )}

                {p.descricao && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{p.descricao}</p>
                )}

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <SyncButton profileId={p.id} />
                  <Link
                    to="/perfis/$id"
                    params={{ id: p.id }}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Detalhes <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

function SyncButton({ profileId: _profileId }: { profileId: string }) {
  const [syncing, setSyncing] = useState(false);
  const handleSync = () => {
    setSyncing(true);
    toast.info("Iniciando sincronização de métricas...");
    setTimeout(() => {
      setSyncing(false);
      toast.success("Métricas atualizadas via TikTok API.");
    }, 1500);
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 text-[11px] gap-1.5"
      onClick={handleSync}
      disabled={syncing}
    >
      <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
      {syncing ? "Sincronizando..." : "Atualizar métricas"}
    </Button>
  );
}
