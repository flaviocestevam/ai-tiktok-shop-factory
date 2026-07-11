import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Sparkles, Building2, Users, KeyRound, Bell } from "lucide-react";

export const Route = createFileRoute("/configuracoes/")({
  head: () => ({ meta: [{ title: "Configurações — Video Factory" }] }),
  component: Page,
});

const active = [
  {
    icon: Cpu,
    title: "Provedores de IA",
    desc: "Modelos para roteiro, imagem e vídeo.",
    to: "/configuracoes/provedores" as const,
  },
  {
    icon: Sparkles,
    title: "Contas Gemini",
    desc: "Chaves e rotação de contas do Google Gemini.",
    to: "/configuracoes/gemini" as const,
  },
];

const upcoming = [
  { icon: Building2, title: "Organização", desc: "Nome interno, fuso horário, moeda padrão." },
  { icon: Users, title: "Equipe", desc: "Membros internos com acesso à fábrica." },
  { icon: KeyRound, title: "Integrações", desc: "TikTok Shop API, Webhooks, Storage." },
  { icon: Bell, title: "Notificações", desc: "Alertas de aprovação, entregas e queda de performance." },
];

function Page() {
  return (
    <PageShell title="Configurações" description="Preferências internas da fábrica.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active.map((s) => (
          <Link key={s.title} to={s.to}>
            <Card className="bg-card/70 hover:border-primary/40 transition h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                </div>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {upcoming.map((s) => (
          <Card key={s.title} className="bg-card/40 opacity-70">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-muted text-muted-foreground grid place-items-center">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px]">Em breve</Badge>
              </div>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
