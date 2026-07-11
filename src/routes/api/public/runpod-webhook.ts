import { createFileRoute } from "@tanstack/react-router";

// Webhook público chamado pelo RunPod quando um job termina.
// Verificação HMAC obrigatória: header `x-runpod-signature` = HMAC-SHA256(rawBody, RUNPOD_WEBHOOK_SECRET).
export const Route = createFileRoute("/api/public/runpod-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const secret = process.env.RUNPOD_WEBHOOK_SECRET;
        const signature = request.headers.get("x-runpod-signature");

        if (secret) {
          if (!signature) return new Response("missing signature", { status: 401 });
          const enc = new TextEncoder();
          const key = await crypto.subtle.importKey(
            "raw",
            enc.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"],
          );
          const sig = await crypto.subtle.sign("HMAC", key, enc.encode(raw));
          const expected = Array.from(new Uint8Array(sig))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          if (expected !== signature.toLowerCase()) {
            return new Response("bad signature", { status: 401 });
          }
        }

        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("invalid json", { status: 400 });
        }

        const jobId: string | undefined = payload.id ?? payload.jobId;
        if (!jobId) return new Response("missing job id", { status: 400 });

        const { mapRunpodStatus } = await import("@/lib/ai/runpod.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const status = mapRunpodStatus(payload.status ?? "queued");
        const videoUrl =
          status === "completed"
            ? (payload.output?.video_url ?? payload.output?.url ?? null)
            : null;

        const { error } = await supabaseAdmin
          .from("geracoes_video")
          .update({
            status,
            video_url: videoUrl,
            custo_usd: payload.executionTime
              ? Number(payload.executionTime) * 0.0004
              : null,
            tempo_execucao_ms: payload.executionTime
              ? Number(payload.executionTime)
              : null,
            concluido_em:
              status === "completed" || status === "failed"
                ? new Date().toISOString()
                : null,
            erro: status === "failed" ? (payload.error ?? "RunPod job failed") : null,
          })
          .eq("runpod_job_id", jobId);

        if (error) {
          console.error("[runpod-webhook] update failed", error);
          return new Response("db error", { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
