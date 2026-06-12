import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, TrendingUp, Layers } from "lucide-react";

export const Route = createFileRoute("/inteligencia")({
  head: () => ({ meta: [{ title: "Inteligência da Fábrica — Video Factory" }] }),
  component: Page,
});

const insights = [
  { icon: TrendingUp, title: "Carrosséis 5 imagens > 7 imagens em conversão", body: "Reduz custo em 18% sem perda de CVR em 4 dos 5 produtos testados." },
  { icon: Layers, title: "Gancho de descoberta domina nicho Casa", body: "“Eu não sabia que precisava disso” performa 2.1× a média no nicho." },
  { icon: Brain, title: "Marina BR é o avatar mais consistente", body: "ROI estável acima de 25x em 3 nichos. Priorizar em novas campanhas." },
  { icon: TrendingUp, title: "Vídeos > 30s estão sangrando custo", body: "Queda de 38% no CVR. Cortar em 12-15s nos próximos." },
];

function Page() {
  return (
    <PageShell
      title="Inteligência da Fábrica"
      description="Aprendizados acumulados de todas as campanhas e perfis."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((i, k) => (
          <Card key={k} className="bg-card/70">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <i.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">{i.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{i.body}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
