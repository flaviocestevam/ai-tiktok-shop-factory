import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { useAvatares } from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/avatares")({
  head: () => ({ meta: [{ title: "Avatares — Video Factory" }] }),
  component: Page,
});

function Page() {
  const { data: avatares, isLoading } = useAvatares();

  if (isLoading) {
    return (
      <PageShell title="Avatares" description="Carregando avatares...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-40 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Avatares"
      description="Personagens fictícios que estrelam os criativos. Escolha um por referência."
      actions={
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo avatar
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {avatares?.map((a: any) => {
          const fotos = a.fotos?.length ?? 0;
          return (
            <Link key={a.id} to="/avatares/$id" params={{ id: a.id }}>
              <Card className="bg-card/70 hover:border-primary/40 transition h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-[var(--gradient-brand)] grid place-items-center text-primary-foreground font-display font-bold text-lg">
                      {a.nome.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-lg font-semibold truncate">{a.nome}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {a.nicho || "—"}
                      </div>
                    </div>
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
                  {a.descricao && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{a.descricao}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <Badge variant="outline" className="gap-1">
                      <Camera className="h-3 w-3" /> {fotos} fotos
                    </Badge>
                    {a.tipo && <Badge variant="outline" className="capitalize">{a.tipo}</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
