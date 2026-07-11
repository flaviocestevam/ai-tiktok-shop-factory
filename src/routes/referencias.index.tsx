import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Film, Images, ArrowUpRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useReferencias, useCreateReferencia, useProdutos, usePerfis, useAvatares,
} from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/referencias/")({
  head: () => ({ meta: [{ title: "Referências — Video Factory" }] }),
  component: Page,
});

const STATUS_LABEL: Record<string, string> = {
  mapeado: "Mapeado",
  analisado: "Analisado",
  kit_pronto: "Kit pronto",
  produzido: "Produzido",
  publicado: "Publicado",
  analisando_resultado: "Analisando resultado",
  concluido: "Concluído",
};

const STATUS_COLOR: Record<string, string> = {
  mapeado: "bg-muted text-muted-foreground border-border",
  analisado: "bg-info/15 text-info border-info/30",
  kit_pronto: "bg-primary/15 text-primary border-primary/30",
  produzido: "bg-warning/15 text-warning border-warning/30",
  publicado: "bg-success/15 text-success border-success/30",
  analisando_resultado: "bg-info/15 text-info border-info/30",
  concluido: "bg-success/15 text-success border-success/30",
};

function Page() {
  const { data: referencias = [], isLoading } = useReferencias();
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const filtradas = referencias.filter((r: any) =>
    statusFilter === "todos" ? true : r.status === statusFilter,
  );

  return (
    <PageShell
      title="Vídeos de Referência"
      description="Vídeos que estão vendendo no TikTok Shop. Cole o link, analise e gere o kit de produção."
      actions={<NovaReferenciaDialog />}
    >
      <div className="flex items-center gap-2 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {filtradas.length} de {referencias.length}
        </span>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      ) : filtradas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          Nenhuma referência ainda. Cole o link de um vídeo que está vendendo para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtradas.map((r: any) => (
            <Card key={r.id} className="bg-card/70 hover:border-primary/40 transition">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {r.tipo_criativo === "carrossel" ? (
                      <Images className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Film className="h-5 w-5 text-primary shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-sm capitalize">{r.tipo_criativo}</div>
                      <a
                        href={r.url_tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 truncate max-w-[220px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {r.url_tiktok} <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                  <Badge className={STATUS_COLOR[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                </div>

                {r.gancho && (
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                    Gancho: <span className="text-foreground">"{r.gancho}"</span>
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                  <Meta k="Produto" v={r.produto?.nome || "—"} />
                  <Meta k="Perfil" v={r.perfil?.nome || "—"} />
                  <Meta k="Avatar" v={r.avatar?.nome || "—"} />
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    to="/referencias/$id"
                    params={{ id: r.id }}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Abrir <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="truncate">{v}</div>
    </div>
  );
}

function NovaReferenciaDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [tipo, setTipo] = useState<"video" | "carrossel">("video");
  const [produtoId, setProdutoId] = useState<string>("");
  const [perfilId, setPerfilId] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");

  const { data: produtos = [] } = useProdutos();
  const { data: perfis = [] } = usePerfis();
  const { data: avatares = [] } = useAvatares();
  const createRef = useCreateReferencia();

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Cole o link do vídeo do TikTok.");
      return;
    }
    try {
      await createRef.mutateAsync({
        url_tiktok: url.trim(),
        tipo_criativo: tipo,
        produto_id: produtoId || null,
        perfil_id: perfilId || null,
        avatar_id: avatarId || null,
      });
      toast.success("Referência criada.");
      setOpen(false);
      setUrl("");
    } catch (e: any) {
      toast.error(e.message || "Falha ao criar referência.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Nova referência
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova referência</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Link do TikTok</Label>
            <Input
              placeholder="https://www.tiktok.com/@perfil/video/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as "video" | "carrossel")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="carrossel">Carrossel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Produto</Label>
              <Select value={produtoId} onValueChange={setProdutoId}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  {produtos.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Perfil (destino)</Label>
              <Select value={perfilId} onValueChange={setPerfilId}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  {perfis.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Avatar</Label>
              <Select value={avatarId} onValueChange={setAvatarId}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  {avatares.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={createRef.isPending}>
            {createRef.isPending ? "Criando..." : "Criar referência"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
