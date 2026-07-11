import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, ArrowUpRight, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { usePerfis, useCreatePerfil } from "@/integrations/supabase/hooks";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/perfis/")({
  head: () => ({ meta: [{ title: "Meus Perfis — Video Factory" }] }),
  component: Page,
});

function Page() {
  const { data: perfis, isLoading } = usePerfis();

  if (isLoading) {
    return (
      <PageShell title="Meus Perfis" description="Carregando perfis...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Meus Perfis"
      description="Perfis próprios do TikTok Shop. Cada perfil concentra referências, criativos e métricas."
      actions={<NovoPerfilDialog />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {perfis?.map((p: any) => {
          const conector = p.conectores?.[0];
          const lastSync = conector?.ultima_sync
            ? new Date(conector.ultima_sync).toLocaleString("pt-BR")
            : "Nunca";

          return (
            <Card key={p.id} className="bg-card/70 hover:border-primary/40 transition overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {p.status}
                      </Badge>
                      {conector && (
                        <Badge className="text-[10px] bg-success/10 text-success border-success/20 gap-1 capitalize">
                          <CheckCircle2 className="h-2.5 w-2.5" /> {conector.status}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold mt-2">{p.nome}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.nicho || "—"} • {p.pais || "—"}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-[var(--gradient-brand)] grid place-items-center text-primary-foreground font-display font-bold">
                    {p.nome.charAt(0)}
                  </div>
                </div>

                {conector && (
                  <div className="mt-3 p-2 rounded-md bg-muted/30 border border-border/40 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Última sincronização: {lastSync}
                    </div>
                  </div>
                )}

                {p.descricao && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{p.descricao}</p>
                )}

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <SyncButton />
                  <Link
                    to="/perfis/$id"
                    params={{ id: p.id }}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Detalhes <ArrowUpRight className="h-3 w-3" />
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

function SyncButton() {
  const qc = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const handleSync = async () => {
    setSyncing(true);
    try {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["perfis"] }),
        qc.invalidateQueries({ queryKey: ["metricas"] }),
      ]);
      toast.success("Dados atualizados.");
    } finally {
      setSyncing(false);
    }
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 text-[11px] gap-1.5"
      onClick={handleSync}
      disabled={syncing}
    >
      <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
      {syncing ? "Atualizando..." : "Atualizar"}
    </Button>
  );
}

function NovoPerfilDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    nicho: "",
    pais: "BR",
    plataforma: "TikTok Shop",
    descricao: "",
  });
  const create = useCreatePerfil();

  const submit = async () => {
    if (!form.nome.trim()) {
      toast.error("Informe o nome do perfil.");
      return;
    }
    try {
      await create.mutateAsync(form);
      toast.success("Perfil criado.");
      setOpen(false);
      setForm({ nome: "", nicho: "", pais: "BR", plataforma: "TikTok Shop", descricao: "" });
    } catch (e: any) {
      toast.error(e.message || "Falha ao criar perfil.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo perfil
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo perfil</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nome</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nicho</Label>
              <Input value={form.nicho} onChange={(e) => setForm({ ...form, nicho: e.target.value })} />
            </div>
            <div>
              <Label>País</Label>
              <Input value={form.pais} onChange={(e) => setForm({ ...form, pais: e.target.value })} />
            </div>
            <div>
              <Label>Plataforma</Label>
              <Input value={form.plataforma} onChange={(e) => setForm({ ...form, plataforma: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending ? "Criando..." : "Criar perfil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
