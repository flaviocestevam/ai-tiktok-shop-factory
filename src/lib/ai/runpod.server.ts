// Server-only helpers for RunPod ComfyUI integration.
// Never imported from client code. Uses fetch (Worker-safe).
import workflowTemplate from "./comfy-workflows/video-ugc.template.json";

export type RunpodJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

function requireRunpodConfig() {
  const apiKey = process.env.RUNPOD_API_KEY;
  const endpointId = process.env.RUNPOD_ENDPOINT_ID;

  if (!apiKey || !endpointId) {
    throw new Error(
      "Geração indisponível: RUNPOD_API_KEY e RUNPOD_ENDPOINT_ID precisam estar configurados.",
    );
  }

  return { apiKey, endpointId };
}

export function buildWorkflow(params: {
  avatarUrl: string;
  produtoUrl: string;
  prompt: string;
  duracaoSeg: number;
}) {
  const json = JSON.stringify(workflowTemplate)
    .replaceAll("{{AVATAR_URL}}", params.avatarUrl)
    .replaceAll("{{PRODUTO_URL}}", params.produtoUrl)
    .replaceAll("{{PROMPT}}", params.prompt.replace(/"/g, '\\"'))
    .replaceAll('"{{DURACAO_SEG}}"', String(params.duracaoSeg))
    .replaceAll("{{DURACAO_SEG}}", String(params.duracaoSeg));
  return JSON.parse(json);
}

export async function submitRunpodJob(input: {
  workflow: unknown;
  webhookUrl?: string;
}): Promise<{ id: string; status: RunpodJobStatus }> {
  const { apiKey, endpointId } = requireRunpodConfig();

  const res = await fetch(`https://api.runpod.ai/v2/${endpointId}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: { workflow: input.workflow },
      webhook: input.webhookUrl,
    }),
  });

  if (!res.ok) {
    throw new Error(`RunPod submit failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string; status?: string };
  return { id: data.id, status: (data.status?.toLowerCase() as RunpodJobStatus) ?? "queued" };
}

export async function fetchRunpodStatus(jobId: string) {
  const { apiKey, endpointId } = requireRunpodConfig();
  const res = await fetch(`https://api.runpod.ai/v2/${endpointId}/status/${jobId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`RunPod status failed: ${res.status}`);
  const data = (await res.json()) as { status: string; output?: any };
  return { status: data.status.toLowerCase() as RunpodJobStatus, output: data.output ?? null };
}

export function mapRunpodStatus(s: string): "queued" | "running" | "completed" | "failed" {
  const v = s.toLowerCase();
  if (v === "completed" || v === "success") return "completed";
  if (v === "failed" || v === "cancelled" || v === "error" || v === "timed_out") return "failed";
  if (v === "in_progress" || v === "running") return "running";
  return "queued";
}
