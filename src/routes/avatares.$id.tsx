import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAvatar,
  useUpdateAvatar,
  useUpsertAvatarFoto,
  useDeleteAvatarFoto,
} from "@/integrations/supabase/hooks";
import { MediaUploader } from "@/components/media-uploader";
import { toast } from "sonner";
import { ChevronLeft, Camera, Sparkles, Trash2 } from "lucide-react";

export const Route = createFileRoute("/avatares/$id")({
  head: () => ({ meta: [{ title: "Avatar — Video Factory" }] }),
  component: AvatarDetail,
});

const POSICOES = [
  { key: "frente", label: "Frente" },
  { key: "perfil", label: "Perfil" },
  { key: "costas", label: "Costas" },
  { key: "corpo_inteiro", label: "Corpo inteiro" },
] as const;

function AvatarDetail() {
  const { id } = useParams({ from: "/avatares/$id" });
  const { data: a, isLoading } = useAvatar(id);
  const update = useUpdateAvatar();
  const upsertFoto = useUpsertAvatarFoto();
  const removeFoto = useDeleteAvatarFoto();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Foto canônica
            </CardTitle>
            <CardDescription>
              Imagem principal que será usada pela IA em toda produção deste avatar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaUploader
              bucket="avatar-fotos"
              path={(a as any).foto_canonica_url}
              prefix={id}
              onUploaded={async (newPath) => {
                await update.mutateAsync({ id, foto_canonica_url: newPath });
              }}
            />
          </CardContent>
        </Card>

        <Card className="bg-card/70 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" /> Fotos adicionais
            </CardTitle>
            <CardDescription>
              {fotos.length} de {POSICOES.length} ângulos cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {POSICOES.map((pos, idx) => {
                const foto = fotos.find((f: any) => f.posicao === pos.key);
                return (
                  <div key={pos.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{pos.label}</span>
                      {foto && (
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-destructive"
                          disabled={removeFoto.isPending}
                          onClick={async () => {
                            try {
                              await removeFoto.mutateAsync({ id: foto.id, avatar_id: id });
                              toast.success("Foto removida.");
                            } catch (e: any) {
                              toast.error(e?.message ?? "Falha ao remover.");
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <MediaUploader
                      bucket="avatar-fotos"
                      path={foto?.storage_path}
                      prefix={`${id}/${pos.key}`}
                      label={`Enviar ${pos.label.toLowerCase()}`}
                      onUploaded={async (newPath) => {
                        await upsertFoto.mutateAsync({
                          avatar_id: id,
                          posicao: pos.key,
                          storage_path: newPath,
                          ordem: idx,
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
