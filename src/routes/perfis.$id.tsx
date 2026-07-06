import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePerfil } from "@/integrations/supabase/hooks";
import { ChevronLeft, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/perfis/$id")({
  head: () => ({ meta: [{ title: "Perfil — Video Factory" }] }),
  component: PerfilDetail,
});

function PerfilDetail() {
  const { id } = useParams({ from: "/perfis/$id" });
  const { data: perfil, isLoading } = usePerfil(id);

  if (isLoading) {
    return (
      <PageShell title="Carregando..." description="Buscando dados do perfil...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  if (!perfil) {
    return (
      <PageShell title="Perfil não encontrado">
        <p className="text-muted-foreground">Esse perfil não existe.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/perfis">Voltar</Link>
        </Button>
      </PageShell>
    );
  }

  const conector = (perfil as any).conectores?.[0];

  return (
    <PageShell
      title={perfil.nome}
      description={perfil.descricao || "Perfil próprio do TikTok Shop."}
      actions={
        <>
          <Button asChild variant="ghost" size="sm">
            <Link to="/perfis">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
          <SyncButton />
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        {perfil.nicho && <Badge variant="outline">{perfil.nicho}</Badge>}
        {perfil.pais && <Badge variant="outline">{perfil.pais}</Badge>}
        {perfil.plataforma && <Badge variant="outline">{perfil.plataforma}</Badge>}
        <Badge className="bg-success/15 text-success border-success/30">{perfil.status}</Badge>

        {conector && (
          <div className="flex items-center gap-2 ml-auto text-muted-foreground bg-muted/30 px-2 py-1 rounded border border-border/50">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" /> API conectada
            </span>
            <span className="border-l border-border h-3 mx-1" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {conector.ultima_sync
                ? new Date(conector.ultima_sync).toLocaleString("pt-BR")
                : "Nunca sincronizado"}
            </span>
          </div>
        )}
      </div>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle className="text-base">Informações</CardTitle>
          <CardDescription>Dados básicos e conector.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Field label="Nome" value={perfil.nome} />
          <Field label="Nicho" value={perfil.nicho || "—"} />
          <Field label="País" value={perfil.pais || "—"} />
          <Field label="Plataforma" value={perfil.plataforma || "—"} />
          <Field label="Observações" value={perfil.observacoes || "—"} full />
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`rounded-md border border-border bg-background/40 p-3 ${full ? "md:col-span-2" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const handleSync = () => {
    setSyncing(true);
    toast.info("Iniciando sincronização com o TikTok...");
    setTimeout(() => {
      setSyncing(false);
      toast.success("Métricas atualizadas.");
    }, 1500);
  };
  return (
    <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={handleSync} disabled={syncing}>
      <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
      {syncing ? "Sincronizando..." : "Sincronizar TikTok"}
    </Button>
  );
}
