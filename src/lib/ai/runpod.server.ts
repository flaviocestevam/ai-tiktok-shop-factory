// Server-only client for the authenticated Railway generation gateway.
// RunPod credentials never enter the Lovable frontend process.

export type RunpodJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

function requireGatewayConfig() {
  const baseUrl = (
    process.env.VIDEO_FACTORY_BACKEND_URL ??
    "https://editor-video-tiktok-backend-production.up.railway.app"
  ).replace(/\/$/, "");
  return { baseUrl };
}

export function buildWorkflow(params: {
  jobId: string;
  avatarUrl: string;
  prompt: string;
  gender?: string | null;
}) {
  const normalizedGender = (params.gender ?? "").toLowerCase();
  const gender = ["masculino", "male", "homem", "m"].includes(normalizedGender)
    ? "male"
    : "female";
  return {
    job_id: params.jobId,
    mode: "photo_to_talking_video" as const,
    character_image_url: params.avatarUrl,
    text: params.prompt,
    language: "pt-BR" as const,
    gender,
    width: 480,
    height: 832,
    audio_cfg: 1,
  };
}

async function gatewayFetch(path: string, authToken: string, init?: RequestInit) {
  const { baseUrl } = requireGatewayConfig();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => null) as { detail?: string } | null;
    throw new Error(payload?.detail ?? `Falha no serviço de geração (HTTP ${res.status}).`);
  }
  return res.json();
}

export async function submitRunpodJob(input: {
  workflow: ReturnType<typeof buildWorkflow>;
  authToken: string;
  webhookUrl?: string;
}): Promise<{ id: string; status: RunpodJobStatus }> {
  const data = await gatewayFetch("/api/generation/jobs", input.authToken, {
    method: "POST",
    body: JSON.stringify(input.workflow),
  }) as { id: string; status?: string };
  return { id: data.id, status: mapRunpodStatus(data.status ?? "queued") };
}

export async function fetchRunpodStatus(jobId: string, authToken: string) {
  const data = await gatewayFetch(`/api/generation/jobs/${encodeURIComponent(jobId)}`, authToken) as {
    status: string;
    output?: Record<string, unknown>;
    error?: string;
  };
  return {
    status: data.status.toLowerCase() as RunpodJobStatus,
    output: data.output ?? (data.error ? { error: data.error } : null),
  };
}

export function mapRunpodStatus(s: string): "queued" | "running" | "completed" | "failed" {
  const v = s.toLowerCase();
  if (v === "completed" || v === "success") return "completed";
  if (v === "failed" || v === "cancelled" || v === "error" || v === "timed_out") return "failed";
  if (v === "in_progress" || v === "running") return "running";
  return "queued";
}
