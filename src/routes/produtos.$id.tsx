import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProduto, useUpdateProduto } from "@/integrations/supabase/hooks";
import { MediaUploader } from "@/components/media-uploader";
import { ChevronLeft, ExternalLink, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/produtos/$id")({
  head: () => ({ meta: [{ title: "Produto — Video Factory" }] }),
  component: ProdutoDetail,
});

function ProdutoDetail() {
  const { id } = useParams({ from: "/produtos/$id" });
  const { data: p, isLoading } = useProduto(id);
  const update = useUpdateProduto();

  if (isLoading) {
    return (
      <PageShell title="Carregando..." description="Buscando dados do produto...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  if (!p) {
    return (
      <PageShell title="Produto não encontrado">
        <p className="text-muted-foreground">Esse produto não existe.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/produtos">Voltar para produtos</Link>
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={p.nome}
      description={`${p.nicho || "Geral"} • ${p.pais || "Brasil"}`}
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link to="/produtos">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" /> Foto do produto
            </CardTitle>
            <CardDescription>
              Imagem imutável usada pela IA em toda geração de vídeo/carrossel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaUploader
              bucket="produto-fotos"
              path={(p as any).foto_principal_url}
              prefix={id}
              aspect="square"
              onUploaded={async (newPath) => {
                await update.mutateAsync({ id, foto_principal_url: newPath });
              }}
            />
          </CardContent>
        </Card>

        <Card className="bg-card/70 md:col-span-2">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline">{p.status}</Badge>
              {p.nicho && <Badge variant="outline">{p.nicho}</Badge>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <Field label="Preço" value={`R$${Number(p.preco || 0).toFixed(2)}`} />
              <Field label="Comissão" value={`${p.comissao_pct || 0}%`} />
              <Field label="Score" value={String(p.score || 0)} />
              <Field label="País" value={p.pais || "—"} />
            </div>
            {p.observacoes && (
              <div className="mt-4 rounded-md border border-border bg-background/40 p-3 text-sm">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Observações
                </div>
                <div>{p.observacoes}</div>
              </div>
            )}
            {p.link_tiktok && (
              <a
                href={p.link_tiktok}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Abrir no TikTok Shop <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
