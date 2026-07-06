import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAvatar } from "@/integrations/supabase/hooks";
import { ChevronLeft, Camera, Upload } from "lucide-react";

export const Route = createFileRoute("/avatares/$id")({
  head: () => ({ meta: [{ title: "Avatar — Video Factory" }] }),
  component: AvatarDetail,
});

function AvatarDetail() {
  const { id } = useParams({ from: "/avatares/$id" });
  const { data: a, isLoading } = useAvatar(id);

  if (isLoading) {
    return (
      <PageShell title="Carregando...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }
  if (!a) {
    return (
      <PageShell title="Avatar não encontrado">
        <p className="text-muted-foreground">Esse avatar não existe.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/avatares">Voltar</Link>
        </Button>
      </PageShell>
    );
  }

  const fotos = (a as any).fotos ?? [];

  return (
    <PageShell
      title={a.nome}
      description={a.descricao || "Personagem fictício da fábrica."}
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link to="/avatares">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Link>
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {(a.nichos ?? []).map((n: string) => <Badge key={n} variant="outline">{n}</Badge>)}
        {a.estilo && <Badge variant="outline" className="capitalize">{a.estilo}</Badge>}
        {a.genero && <Badge variant="outline" className="capitalize">{a.genero}</Badge>}
        <Badge
          className={
            a.status === "ativo"
              ? "bg-success/15 text-success border-success/30"
              : "bg-muted text-muted-foreground"
          }
        >
          {a.status}
        </Badge>
      </div>

      <Card className="bg-card/70">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" /> Fotos canônicas
            </CardTitle>
            <CardDescription>{fotos.length} fotos cadastradas.</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fotos.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground">
                Nenhuma foto cadastrada ainda.
              </div>
            )}
            {fotos.map((f: any) => (
              <div
                key={f.id}
                className="aspect-[3/4] rounded-lg border border-primary/30 bg-primary/5 overflow-hidden"
              >
                {f.url ? (
                  <img src={f.url} alt={f.tipo || "foto"} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
                    {f.tipo || "Foto"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
