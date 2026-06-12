import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import { clientes } from "@/lib/mock/data";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Page() {
  return (
    <PageShell
      title="Clientes da Organização"
      description="Clientes recorrentes da fábrica. Eles não acessam a plataforma — todo o controle é interno."
      actions={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Novo cliente</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clientes.map((c) => {
          const margem = ((c.valor - c.custoProducao) / c.valor) * 100;
          const total = c.videosContratados + c.carrosseisContratados;
          const pct = Math.round((c.criativosEntregues / total) * 100);
          return (
            <Card key={c.id} className="bg-card/70 hover:border-primary/40 transition">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="text-[10px] uppercase">{c.plano}</Badge>
                    <h3 className="font-display text-xl font-semibold mt-2">{c.empresa}</h3>
                    <p className="text-xs text-muted-foreground">{c.nome} • {c.nicho}</p>
                  </div>
                  <Badge className={
                    c.status === "em dia" ? "bg-success/15 text-success border-success/30" :
                    c.status === "pendente" ? "bg-warning/15 text-warning border-warning/30" :
                    "bg-destructive/15 text-destructive border-destructive/30"
                  }>{c.status}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  <div className="rounded-lg border border-border bg-background/40 p-2">
                    <div className="text-muted-foreground text-[10px] uppercase">Cobrança</div>
                    <div className="font-display font-semibold">{brl(c.valor)}</div>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 p-2">
                    <div className="text-muted-foreground text-[10px] uppercase">Margem</div>
                    <div className="font-display font-semibold text-success">{margem.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 p-2">
                    <div className="text-muted-foreground text-[10px] uppercase">Entregue</div>
                    <div className="font-display font-semibold">{pct}%</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {c.videosContratados} vídeos + {c.carrosseisContratados} carrosséis
                </div>

                <div className="mt-3 flex justify-end">
                  <Link to="/clientes/$id" params={{ id: c.id }} className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    Abrir dashboard <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
