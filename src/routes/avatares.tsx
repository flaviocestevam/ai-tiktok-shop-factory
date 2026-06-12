import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { avatares } from "@/lib/mock/data";

export const Route = createFileRoute("/avatares")({
  head: () => ({ meta: [{ title: "Avatares — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  return (
    <PageShell
      title="Avatares"
      description="Biblioteca interna de avatares. O cliente não escolhe — a equipe seleciona por campanha."
      actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Novo avatar</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {avatares.map((a) => (
          <Link key={a.id} to="/avatares/$id" params={{ id: a.id }}>
            <Card className="bg-card/70 hover:border-primary/40 transition h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-[var(--gradient-brand)] grid place-items-center text-primary-foreground font-display font-bold text-lg">
                    {a.nome.split(" ").map(x => x[0]).slice(0,2).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg font-semibold">{a.nome}</div>
                    <div className="text-xs text-muted-foreground">{a.nichos.join(" • ")}</div>
                  </div>
                  <Badge className={a.status === "ativo" ? "bg-success/15 text-success border-success/30 ml-auto" : "bg-muted text-muted-foreground ml-auto"}>
                    {a.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{a.descricao}</p>

                <div className="flex items-center gap-2 mt-3 text-xs">
                  <Badge variant="outline" className="gap-1"><Camera className="h-3 w-3" />{a.fotosCanonicas} fotos</Badge>
                  <Badge variant="outline" className="capitalize">{a.tipo}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  <Stat label="ROI" value={`${a.roi.toFixed(1)}x`} />
                  <Stat label="CPV" value={brl(a.custoPorVenda)} />
                  <Stat label="Vendas" value={a.vendasAtribuidas.toLocaleString("pt-BR")} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
