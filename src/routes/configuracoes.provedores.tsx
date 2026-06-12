import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/configuracoes/provedores")({
  head: () => ({ meta: [{ title: "Provedores de IA — Video Factory" }] }),
  component: Page,
});

const provedores = [
  { nome: "OpenAI GPT-5", area: "Roteiros e ganchos", status: "ativo", custo: "$0.005 / 1k tokens" },
  { nome: "Anthropic Claude 4.5", area: "Roteiros longos", status: "ativo", custo: "$0.008 / 1k tokens" },
  { nome: "Google Gemini 2.5", area: "Análise de produto", status: "pausado", custo: "$0.004 / 1k tokens" },
  { nome: "Flux Pro", area: "Imagens para carrossel", status: "ativo", custo: "$0.04 / imagem" },
  { nome: "Midjourney v7", area: "Imagens premium", status: "ativo", custo: "$0.10 / imagem" },
  { nome: "Runway Gen-4", area: "Vídeos curtos", status: "ativo", custo: "$0.18 / segundo" },
  { nome: "ElevenLabs", area: "Voz / dublagem", status: "ativo", custo: "$0.30 / minuto" },
];

function Page() {
  return (
    <PageShell
      title="Provedores de IA"
      description="Configure quais modelos a fábrica usa em cada etapa da produção."
      actions={<Button asChild variant="ghost" size="sm"><Link to="/configuracoes"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link></Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {provedores.map((p) => (
          <Card key={p.nome} className="bg-card/70">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>{p.area}</CardDescription>
                  <CardTitle className="text-base">{p.nome}</CardTitle>
                </div>
                <Switch defaultChecked={p.status === "ativo"} />
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-xs">
              <Badge variant="outline">{p.custo}</Badge>
              <Badge className={p.status === "ativo" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                {p.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
