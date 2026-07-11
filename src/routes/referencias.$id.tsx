import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronLeft, Copy, ExternalLink, Sparkles, CheckCircle2, Wand2, Save, Film, Images, Video, Loader2, RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useReferencia, useUpdateReferencia, useGeracoesByReferencia, useInvalidateGeracoes } from "@/integrations/supabase/hooks";
import { useServerFn } from "@tanstack/react-start";
import { gerarVideo, atualizarStatusGeracao } from "@/lib/ai/runpod.functions";
import { gerarRoteiroAdaptado } from "@/lib/ai/lovable-ai.functions";

export const Route = createFileRoute("/referencias/$id")({
  head: () => ({ meta: [{ title: "Referência — Video Factory" }] }),
  component: ReferenciaDetail,
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

function ReferenciaDetail() {
  const { id } = useParams({ from: "/referencias/$id" });
  const { data: r, isLoading } = useReferencia(id);
  const update = useUpdateReferencia();
  const gerarRoteiro = useServerFn(gerarRoteiroAdaptado);
  const [gerandoRoteiro, setGerandoRoteiro] = useState(false);

  const [form, setForm] = useState({
    transcricao: "",
    gancho: "",
    estrutura: "",
    duracao_seg: 0,
    views_estimadas: 0,
    roteiro_adaptado: "",
    observacoes: "",
  });

  useEffect(() => {
    if (r) {
      setForm({
        transcricao: r.transcricao ?? "",
        gancho: r.gancho ?? "",
        estrutura: r.estrutura ?? "",
        duracao_seg: r.duracao_seg ?? 0,
        views_estimadas: r.views_estimadas ?? 0,
        roteiro_adaptado: r.roteiro_adaptado ?? "",
        observacoes: r.observacoes ?? "",
      });
    }
  }, [r]);

  if (isLoading) {
    return (
      <PageShell title="Carregando...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }
  if (!r) {
    return (
      <PageShell title="Referência não encontrada">
        <Button asChild variant="outline" className="mt-4">
          <Link to="/referencias">Voltar</Link>
        </Button>
      </PageShell>
    );
  }

  const salvarAnalise = async () => {
    try {
      const patch: any = { ...form };
      // se tem gancho + estrutura, avança para "analisado"
      if (r.status === "mapeado" && form.gancho && form.estrutura) {
        patch.status = "analisado";
      }
      await update.mutateAsync({ id, ...patch });
      toast.success("Análise salva.");
    } catch (e: any) {
      toast.error(e.message || "Falha ao salvar.");
    }
  };

  const gerarRoteiroIA = async () => {
    setGerandoRoteiro(true);
    try {
      const res = await gerarRoteiro({
        data: {
          gancho: form.gancho,
          transcricao: form.transcricao,
          estrutura: form.estrutura,
          duracao_seg: form.duracao_seg || 15,
          produto_nome: r?.produto?.nome || "",
        },
      });
      setForm((f) => ({ ...f, roteiro_adaptado: res.roteiro }));
      toast.success("Roteiro gerado.");
    } catch (e: any) {
      toast.error(e.message || "Falha ao gerar roteiro.");
    } finally {
      setGerandoRoteiro(false);
    }
  };

  const marcarProduzido = async () => {
    await update.mutateAsync({ id, status: "produzido" });
    toast.success("Marcado como produzido.");
  };

  const promptVideo = buildPromptVideo(r, form);

  return (
    <PageShell
      title={`Referência • ${r.tipo_criativo}`}
      description={r.url_tiktok}
      actions={
        <>
          <Button asChild variant="ghost" size="sm">
            <Link to="/referencias">
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Link>
          </Button>
          <Select
            value={r.status}
            onValueChange={async (v) => {
              await update.mutateAsync({ id, status: v });
              toast.success("Status atualizado.");
            }}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <Badge variant="outline" className="capitalize gap-1">
          {r.tipo_criativo === "carrossel" ? <Images className="h-3 w-3" /> : <Film className="h-3 w-3" />}
          {r.tipo_criativo}
        </Badge>
        <Badge variant="outline">Produto: {r.produto?.nome || "—"}</Badge>
        <Badge variant="outline">Perfil: {r.perfil?.nome || "—"}</Badge>
        <Badge variant="outline">Avatar: {r.avatar?.nome || "—"}</Badge>
        <a
          href={r.url_tiktok}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-primary inline-flex items-center gap-1 hover:underline"
        >
          Abrir vídeo original <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Análise da referência</CardTitle>
            <CardDescription>Extraia o que faz o vídeo original converter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Transcrição / fala do vídeo original">
              <Textarea
                rows={5}
                value={form.transcricao}
                onChange={(e) => setForm({ ...form, transcricao: e.target.value })}
                placeholder="Cole a transcrição do vídeo original..."
              />
            </Field>
            <Field label="Gancho (primeiros 2 segundos)">
              <Input
                value={form.gancho}
                onChange={(e) => setForm({ ...form, gancho: e.target.value })}
                placeholder='Ex: "Eu não sabia que precisava disso..."'
              />
            </Field>
            <Field label="Estrutura (cenas / cortes / enquadramentos)">
              <Textarea
                rows={4}
                value={form.estrutura}
                onChange={(e) => setForm({ ...form, estrutura: e.target.value })}
                placeholder="Cena 1: close no problema&#10;Cena 2: apresentação do produto&#10;..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duração (segundos)">
                <Input
                  type="number"
                  value={form.duracao_seg}
                  onChange={(e) => setForm({ ...form, duracao_seg: Number(e.target.value) })}
                />
              </Field>
              <Field label="Views estimadas">
                <Input
                  type="number"
                  value={form.views_estimadas}
                  onChange={(e) => setForm({ ...form, views_estimadas: Number(e.target.value) })}
                />
              </Field>
            </div>
            <Field label="Observações">
              <Textarea
                rows={2}
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              />
            </Field>
            <div className="flex gap-2">
              <Button onClick={salvarAnalise} disabled={update.isPending} className="gap-1.5">
                <Save className="h-4 w-4" /> Salvar análise
              </Button>
              <Button variant="outline" onClick={gerarRoteiroIA} disabled={gerandoRoteiro} className="gap-1.5">
                {gerandoRoteiro ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                {gerandoRoteiro ? "Gerando..." : "Gerar roteiro com IA"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Roteiro adaptado
            </CardTitle>
            <CardDescription>Sua versão do roteiro, para produzir na ferramenta externa.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={16}
              value={form.roteiro_adaptado}
              onChange={(e) => setForm({ ...form, roteiro_adaptado: e.target.value })}
              placeholder="Aqui vai o roteiro adaptado (gerado por IA ou escrito à mão)."
              className="font-mono text-xs"
            />
            <div className="mt-3 flex gap-2">
              <CopyBtn text={form.roteiro_adaptado} label="Copiar roteiro" />
              <Button onClick={salvarAnalise} variant="outline" className="gap-1.5">
                <Save className="h-4 w-4" /> Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KIT DE PRODUÇÃO */}
      {["analisado", "kit_pronto", "produzido", "publicado", "analisando_resultado", "concluido"].includes(r.status) && (
        <Card className="bg-card/70 mt-6 border-primary/40">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Kit de Produção
            </CardTitle>
            <CardDescription>
              {r.tipo_criativo === "carrossel"
                ? "Slides gerados para publicação direta no TikTok."
                : "Tudo pronto para colar na ferramenta externa de geração de vídeo."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <KitBlock title="Gancho">
                <p className="text-sm">"{form.gancho || "—"}"</p>
                <CopyBtn text={form.gancho} />
              </KitBlock>
              <KitBlock title="Duração alvo">
                <p className="text-sm font-display text-xl">{form.duracao_seg || "?"}s</p>
              </KitBlock>
              <KitBlock title="Referência original">
                <a
                  href={r.url_tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1 break-all"
                >
                  {r.url_tiktok} <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </KitBlock>
            </div>

            <KitBlock title="Roteiro adaptado (para produção)">
              <pre className="text-xs whitespace-pre-wrap font-mono max-h-64 overflow-auto">
                {form.roteiro_adaptado || "— gere o roteiro primeiro"}
              </pre>
              <CopyBtn text={form.roteiro_adaptado} label="Copiar roteiro" />
            </KitBlock>

            {r.tipo_criativo === "video" ? (
              <>
                <KitBlock title="Prompt de vídeo (colar na ferramenta externa)">
                  <pre className="text-xs whitespace-pre-wrap font-mono max-h-64 overflow-auto">
                    {promptVideo}
                  </pre>
                  <CopyBtn text={promptVideo} label="Copiar prompt" />
                </KitBlock>
                <KitBlock title="Imagem base (avatar + produto)">
                  <div className="aspect-video rounded-lg border border-dashed border-border bg-muted/30 grid place-items-center text-xs text-muted-foreground">
                    Geração de imagem via IA será integrada aqui.
                  </div>
                </KitBlock>
              </>
            ) : (
              <KitBlock title="Slides do carrossel">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="aspect-[3/4] rounded-lg border border-dashed border-border bg-muted/30 grid place-items-center text-xs text-muted-foreground"
                    >
                      Slide {n}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Geração de slides via IA será integrada aqui.
                </p>
              </KitBlock>
            )}

            <GeracoesVideoBlock
              referenciaId={r.id}
              prompt={promptVideo}
              duracaoSeg={form.duracao_seg || 6}
            />

            {r.status !== "produzido" && r.status !== "publicado" && r.status !== "concluido" && (
              <Button onClick={marcarProduzido} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Marcar como produzido
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}

function GeracoesVideoBlock({
  referenciaId,
  prompt,
  duracaoSeg,
}: {
  referenciaId: string;
  prompt: string;
  duracaoSeg: number;
}) {
  const { data: geracoes = [] } = useGeracoesByReferencia(referenciaId);
  const invalidate = useInvalidateGeracoes();
  const gerar = useServerFn(gerarVideo);
  const atualizar = useServerFn(atualizarStatusGeracao);
  const [loading, setLoading] = useState(false);

  const onGerar = async () => {
    setLoading(true);
    try {
      const res = await gerar({ data: { referencia_id: referenciaId, prompt, duracao_seg: duracaoSeg } });
      if (res.status === "mock") {
        toast.info("Modo simulação — configure RUNPOD_API_KEY para gerar de verdade.");
      } else {
        toast.success("Job enviado para o RunPod.");
      }
      await invalidate(referenciaId);
    } catch (e: any) {
      toast.error(e.message || "Falha ao gerar vídeo.");
    } finally {
      setLoading(false);
    }
  };

  const onAtualizar = async (id: string) => {
    try {
      await atualizar({ data: { geracao_id: id } });
      await invalidate(referenciaId);
    } catch (e: any) {
      toast.error(e.message || "Falha ao atualizar.");
    }
  };

  return (
    <KitBlock title="Geração de vídeo (RunPod + ComfyUI)">
      <div className="flex items-center gap-2">
        <Button onClick={onGerar} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
          Gerar vídeo
        </Button>
        <span className="text-xs text-muted-foreground">
          Usa foto do avatar + foto do produto + roteiro. Duração: {duracaoSeg}s.
        </span>
      </div>

      {geracoes.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma geração ainda.</p>
      ) : (
        <div className="space-y-2">
          {geracoes.map((g: any) => (
            <div key={g.id} className="rounded-md border border-border bg-background/60 p-2 text-xs">
              <div className="flex items-center gap-2">
                <StatusPill status={g.status} />
                <span className="text-muted-foreground font-mono truncate">{g.runpod_job_id}</span>
                <span className="ml-auto text-muted-foreground">
                  {new Date(g.created_at).toLocaleString("pt-BR")}
                </span>
                {["queued", "running"].includes(g.status) && (
                  <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => onAtualizar(g.id)}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {g.video_url && (
                <video
                  src={g.video_url}
                  controls
                  className="mt-2 w-full max-w-xs aspect-[9/16] rounded-md bg-black"
                />
              )}
              {g.erro && <p className="mt-1 text-destructive">{g.erro}</p>}
              {g.custo_usd != null && (
                <p className="mt-1 text-muted-foreground">Custo: US$ {Number(g.custo_usd).toFixed(4)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </KitBlock>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: "bg-muted text-muted-foreground",
    running: "bg-primary/20 text-primary",
    completed: "bg-emerald-500/20 text-emerald-400",
    failed: "bg-destructive/20 text-destructive",
    mock: "bg-yellow-500/20 text-yellow-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${map[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function KitBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CopyBtn({ text, label = "Copiar" }: { text: string; label?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 gap-1 text-[11px] px-2"
      onClick={() => {
        navigator.clipboard.writeText(text || "");
        toast.success("Copiado!");
      }}
    >
      <Copy className="h-3 w-3" /> {label}
    </Button>
  );
}

function buildPromptVideo(r: any, form: { gancho: string; estrutura: string; duracao_seg: number }) {
  return `# Prompt para gerar vídeo UGC
Produto: ${r.produto?.nome || "—"}
Avatar: ${r.avatar?.nome || "—"}
Duração: ${form.duracao_seg || "?"}s
Formato: 9:16 vertical, TikTok Shop

## Gancho (0-2s)
"${form.gancho || "—"}"

## Estrutura (cenas)
${form.estrutura || "—"}

## Regras
- A foto do produto é imutável (não redesenhar).
- Avatar aparece interagindo com o produto.
- CTA final para o link do TikTok Shop.
`;
}
