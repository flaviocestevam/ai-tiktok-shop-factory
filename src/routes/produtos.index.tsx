import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useProdutos, useCreateProduto } from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/produtos/")({
  head: () => ({ meta: [{ title: "Produtos — Video Factory" }] }),
  component: Page,
});

const statusColor: Record<string, string> = {
  ativo: "bg-success/15 text-success border-success/30",
  pausado: "bg-muted text-muted-foreground border-border",
  vencedor: "bg-success/15 text-success border-success/30",
  teste: "bg-warning/15 text-warning border-warning/30",
};

function Page() {
  const { data: produtos, isLoading } = useProdutos();

  if (isLoading) {
    return (
      <PageShell title="Produtos" description="Carregando produtos...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-56 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Produtos"
      description="Produtos do TikTok Shop que você promove."
      actions={<NovoProdutoDialog />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {produtos?.map((p: any) => (
          <Link key={p.id} to="/produtos/$id" params={{ id: p.id }}>
            <Card className="bg-card/70 hover:border-primary/40 transition overflow-hidden h-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.nome}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.nicho || "—"}</div>
                  </div>
                  <Badge className={statusColor[p.status] ?? "border-border"}>{p.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <Stat label="Preço" value={`R$${Number(p.preco || 0).toFixed(0)}`} />
                  <Stat label="Comissão" value={`${p.comissao_pct || 0}%`} />
                  <Stat label="Score" value={String(p.score || 0)} />
                </div>
                {p.link_tiktok && (
                  <div className="mt-3 text-[11px] text-muted-foreground truncate">
                    {p.link_tiktok}
                  </div>
                )}
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

function NovoProdutoDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", nicho: "", preco: "", comissao_pct: "", link_tiktok: "", observacoes: "" });
  const create = useCreateProduto();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) return toast.error("Informe o nome do produto.");
    try {
      const p: any = await create.mutateAsync({
        nome: form.nome.trim(),
        nicho: form.nicho || null,
        preco: form.preco ? Number(form.preco) : null,
        comissao_pct: form.comissao_pct ? Number(form.comissao_pct) : null,
        link_tiktok: form.link_tiktok || null,
        observacoes: form.observacoes || null,
      });
      toast.success("Produto criado.");
      setOpen(false);
      navigate({ to: "/produtos/$id", params: { id: p.id } });
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao criar produto.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo produto</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nicho</Label><Input value={form.nicho} onChange={(e) => setForm({ ...form, nicho: e.target.value })} /></div>
            <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} /></div>
            <div><Label>Comissão (%)</Label><Input type="number" step="1" value={form.comissao_pct} onChange={(e) => setForm({ ...form, comissao_pct: e.target.value })} /></div>
            <div><Label>Link TikTok</Label><Input value={form.link_tiktok} onChange={(e) => setForm({ ...form, link_tiktok: e.target.value })} /></div>
          </div>
          <div><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} /></div>
          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? "Criando..." : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
