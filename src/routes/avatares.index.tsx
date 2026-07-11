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
import { Plus, Camera } from "lucide-react";
import { toast } from "sonner";
import { useAvatares, useCreateAvatar } from "@/integrations/supabase/hooks";

export const Route = createFileRoute("/avatares/")({
  head: () => ({ meta: [{ title: "Avatares — Video Factory" }] }),
  component: Page,
});

function Page() {
  const { data: avatares, isLoading } = useAvatares();

  if (isLoading) {
    return (
      <PageShell title="Avatares" description="Carregando avatares...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-40 animate-pulse bg-card/50" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Avatares"
      description="Personagens fictícios que estrelam os criativos. Escolha um por referência."
      actions={<NovoAvatarDialog />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {avatares?.map((a: any) => {
          const fotos = a.fotos?.length ?? 0;
          return (
            <Link key={a.id} to="/avatares/$id" params={{ id: a.id }}>
              <Card className="bg-card/70 hover:border-primary/40 transition h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-[var(--gradient-brand)] grid place-items-center text-primary-foreground font-display font-bold text-lg">
                      {a.nome.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-lg font-semibold truncate">{a.nome}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {(a.nichos ?? []).join(" • ") || "—"}
                      </div>
                    </div>
                    <Badge
                      className={
                        a.status === "ativo"
                          ? "bg-success/15 text-success border-success/30"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                  {a.descricao && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{a.descricao}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <Badge variant="outline" className="gap-1">
                      <Camera className="h-3 w-3" /> {fotos} fotos
                    </Badge>
                    {a.estilo && <Badge variant="outline" className="capitalize">{a.estilo}</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}

function NovoAvatarDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", genero: "", idade_estimada: "", estilo: "", nichos: "", descricao: "" });
  const create = useCreateAvatar();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) return toast.error("Informe o nome do avatar.");
    try {
      const a: any = await create.mutateAsync({
        nome: form.nome.trim(),
        genero: form.genero || null,
        idade_estimada: form.idade_estimada || null,
        estilo: form.estilo || null,
        nichos: form.nichos ? form.nichos.split(",").map((s) => s.trim()).filter(Boolean) : [],
        descricao: form.descricao || null,
      });
      toast.success("Avatar criado. Envie a foto canônica na próxima tela.");
      setOpen(false);
      navigate({ to: "/avatares/$id", params: { id: a.id } });
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao criar avatar.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo avatar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo avatar</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Gênero</Label><Input value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })} /></div>
            <div><Label>Idade estimada</Label><Input value={form.idade_estimada} onChange={(e) => setForm({ ...form, idade_estimada: e.target.value })} placeholder="ex.: 25-30" /></div>
            <div><Label>Estilo</Label><Input value={form.estilo} onChange={(e) => setForm({ ...form, estilo: e.target.value })} placeholder="casual, fitness..." /></div>
            <div><Label>Nichos (vírgula)</Label><Input value={form.nichos} onChange={(e) => setForm({ ...form, nichos: e.target.value })} placeholder="beleza, saúde" /></div>
          </div>
          <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? "Criando..." : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
