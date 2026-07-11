import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  gancho: z.string().optional().default(""),
  transcricao: z.string().optional().default(""),
  estrutura: z.string().optional().default(""),
  duracao_seg: z.number().optional().default(15),
  produto_nome: z.string().optional().default(""),
});

export const gerarRoteiroAdaptado = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY não configurada.");
    }

    const prompt = `Você é roteirista de vídeos curtos para TikTok Shop.
Baseado na referência abaixo, escreva um roteiro adaptado em PT-BR, em formato de cenas numeradas, com fala do avatar, ação e enquadramento. Termine com CTA claro para o produto.

Produto: ${data.produto_nome || "não informado"}
Duração alvo: ${data.duracao_seg}s
Gancho da referência: ${data.gancho || "não informado"}
Estrutura da referência:
${data.estrutura || "não informada"}

Transcrição da referência:
${data.transcricao || "não informada"}

Retorne SOMENTE o roteiro final, sem comentários.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Lovable AI [${res.status}]: ${body}`);
    }

    const json = await res.json();
    const roteiro = json?.choices?.[0]?.message?.content?.trim() ?? "";
    return { roteiro };
  });
