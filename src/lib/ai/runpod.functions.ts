import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Kicks off a RunPod ComfyUI job to generate a video for a given referência.
// Runs in mock mode when RUNPOD_* env vars are missing, so the whole UI flow
// (button → progresso → registro em geracoes_video) já funciona antes da
// integração real. Basta ligar as chaves depois.
export const gerarVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        referencia_id: z.string().uuid(),
        prompt: z.string().min(4),
        duracao_seg: z.number().int().min(3).max(60),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // 1. Carrega a referência + avatar + produto (com URLs das fotos).
    const { data: ref, error: refErr } = await supabase
      .from("videos_referencia")
      .select(
        "id, produto:produtos(id, foto_principal_url), avatar:avatares(id, foto_canonica_url)",
      )
      .eq("id", data.referencia_id)
      .single();
    if (refErr || !ref) throw new Error(refErr?.message ?? "Referência não encontrada");

    const avatarPath = (ref.avatar as any)?.foto_canonica_url;
    const produtoPath = (ref.produto as any)?.foto_principal_url;
    if (!avatarPath || !produtoPath) {
      throw new Error(
        "Faltam imagens: cadastre a foto canônica do avatar e a foto principal do produto.",
      );
    }

    // 2. Assina URLs por 1h para o ComfyUI conseguir baixar.
    const [{ data: aSig }, { data: pSig }] = await Promise.all([
      supabase.storage.from("avatar-fotos").createSignedUrl(avatarPath, 3600),
      supabase.storage.from("produto-fotos").createSignedUrl(produtoPath, 3600),
    ]);
    if (!aSig?.signedUrl || !pSig?.signedUrl) {
      throw new Error("Falha ao gerar URLs assinadas das imagens.");
    }

    // 3. Monta workflow + chama RunPod (ou entra em modo mock).
    const { buildWorkflow, submitRunpodJob } = await import("./runpod.server");
    const workflow = buildWorkflow({
      avatarUrl: aSig.signedUrl,
      produtoUrl: pSig.signedUrl,
      prompt: data.prompt,
      duracaoSeg: data.duracao_seg,
    });

    const webhookUrl = process.env.PUBLIC_BASE_URL
      ? `${process.env.PUBLIC_BASE_URL}/api/public/runpod-webhook`
      : undefined;

    const job = await submitRunpodJob({ workflow, webhookUrl });

    // 4. Registra em geracoes_video usando supabaseAdmin (bypassa RLS para
    //    conseguir criar mesmo antes de terminarmos as policies finais).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: gen, error: genErr } = await supabaseAdmin
      .from("geracoes_video")
      .insert({
        referencia_id: ref.id,
        produto_id: (ref.produto as any)?.id ?? null,
        avatar_id: (ref.avatar as any)?.id ?? null,
        runpod_job_id: job.id,
        status: job.status === "mock" ? "mock" : "queued",
        iniciado_em: new Date().toISOString(),
        input_payload: {
          prompt: data.prompt,
          duracao_seg: data.duracao_seg,
          avatar_url: aSig.signedUrl,
          produto_url: pSig.signedUrl,
        },
        workflow_snapshot: workflow,
      })
      .select()
      .single();
    if (genErr) throw new Error(genErr.message);

    return { id: gen.id, runpod_job_id: job.id, status: gen.status };
  });

// Polls status manualmente (útil quando o webhook ainda não está configurado).
export const atualizarStatusGeracao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ geracao_id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { fetchRunpodStatus, mapRunpodStatus } = await import("./runpod.server");

    const { data: gen, error } = await supabaseAdmin
      .from("geracoes_video")
      .select("id, runpod_job_id, status")
      .eq("id", data.geracao_id)
      .single();
    if (error || !gen) throw new Error(error?.message ?? "Geração não encontrada");
    if (!gen.runpod_job_id) return { status: gen.status };

    const remote = await fetchRunpodStatus(gen.runpod_job_id);
    if (remote.status === "mock") return { status: gen.status };

    const status = mapRunpodStatus(remote.status);
    const videoUrl =
      status === "completed"
        ? (remote.output?.video_url ?? remote.output?.url ?? null)
        : null;

    await supabaseAdmin
      .from("geracoes_video")
      .update({
        status,
        video_url: videoUrl,
        concluido_em: status === "completed" || status === "failed" ? new Date().toISOString() : null,
        erro: status === "failed" ? (remote.output?.error ?? "RunPod job failed") : null,
      })
      .eq("id", gen.id);

    return { status, video_url: videoUrl };
  });
