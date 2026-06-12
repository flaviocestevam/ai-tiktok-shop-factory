import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Building2, Users, KeyRound, Bell } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Video Factory" }] }),
  component: Page,
});

const sections = [
  { icon: Building2, title: "Organização", desc: "Nome interno, fuso horário, moeda padrão." },
  { icon: Users, title: "Equipe", desc: "Membros internos com acesso à fábrica." },
  { icon: KeyRound, title: "Integrações", desc: "TikTok Shop API, Webhooks, Storage." },
  { icon: Bell, title: "Notificações", desc: "Alertas de aprovação, entregas e queda de performance." },
];

function Page() {
  return (
    <PageShell title="Configurações" description="Preferências internas da fábrica.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/configuracoes/provedores">
          <Card className="bg-card/70 hover:border-primary/40 transition">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Cpu className="h-4 w-4" /></div>
                <CardTitle className="text-base">Provedores de IA</CardTitle>
              </div>
              <CardDescription>Modelos para roteiro, imagem e vídeo.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        {sections.map((s) => (
          <Card key={s.title} className="bg-card/70">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-muted text-foreground grid place-items-center"><s.icon className="h-4 w-4" /></div>
                <CardTitle className="text-base">{s.title}</CardTitle>
              </div>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
