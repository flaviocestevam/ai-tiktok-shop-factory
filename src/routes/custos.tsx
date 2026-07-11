import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCustos, useCreateCusto, useReferencias } from "@/integrations/supabase/hooks";
import { Constants } from "@/integrations/supabase/types";
import { Coins, Wallet, ReceiptText, TrendingUp, Plus } from "lucide-react";

export const Route = createFileRoute("/custos")({
  head: () => ({ meta: [{ title: "Custos — Video Factory" }] }),
  component: Page,
});

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

function Page() {
  const { data: custos = [], isLoading } = useCustos();
  const { data: referencias = [] } = useReferencias();

  if (isLoading) {
    return (
      <PageShell title="Custos" description="Carregando custos...">
        <div className="h-64 animate-pulse bg-card/50 rounded-lg" />
      </PageShell>
    );
  }

  const totalCustos = custos.reduce((s, c: any) => s + Number(c.total_cost || 0), 0);
  const ia = custos
    .filter((c: any) =>
      ["script_generation", "image_generation", "video_generation", "carousel_generation", "voice_generation"].includes(c.cost_type),
    )
    .reduce((s, c: any) => s + Number(c.total_cost || 0), 0);
  const storage = custos
    .filter((c: any) => c.cost_type === "storage")
    .reduce((s, c: any) => s + Number(c.total_cost || 0), 0);

  const producao = referencias.length * 45;

  return (
    <PageShell
      title="Custos"
      description="Custo de IA, produção e storage."
      actions={<NovoCustoDialog />}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Custo IA" value={brl(ia)} icon={Coins} tone="warning" />
        <MetricCard label="Storage" value={brl(storage)} icon={Wallet} />
        <MetricCard label="Produção estimada" value={brl(producao)} icon={ReceiptText} />
        <MetricCard label="Total" value={brl(totalCustos + producao)} icon={TrendingUp} tone="success" />
      </div>

      <Card className="bg-card/70 mt-6">
        <CardHeader>
          <CardTitle className="text-base">Últimos custos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Provedor</th>
                <th className="text-right p-3">Quantidade</th>
                <th className="text-right p-3">Custo total</th>
                <th className="text-left p-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {custos.map((c: any) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="p-3">{c.cost_type}</td>
                  <td className="p-3 text-muted-foreground">{c.provider_name}</td>
                  <td className="p-3 text-right">{c.quantity || 0}</td>
                  <td className="p-3 text-right">{brl(Number(c.total_cost || 0))}</td>
                  <td className="p-3 text-muted-foreground">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "—"}
                  </td>
                </tr>
              ))}
              {custos.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum custo registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function NovoCustoDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    cost_type: "manual_review" as string,
    provider_name: "",
    quantity: "1",
    unit_cost: "",
    currency: "BRL",
  });
  const create = useCreateCusto();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.provider_name.trim()) return toast.error("Informe o provedor.");
    const qty = Number(form.quantity) || 0;
    const unit = Number(form.unit_cost) || 0;
    try {
      await create.mutateAsync({
        cost_type: form.cost_type,
        provider_name: form.provider_name.trim(),
        quantity: qty,
        unit_cost: unit,
        total_cost: qty * unit,
        currency: form.currency || "BRL",
        status: "confirmed",
      });
      toast.success("Custo registrado.");
      setOpen(false);
      setForm({ cost_type: "manual_review", provider_name: "", quantity: "1", unit_cost: "", currency: "BRL" });
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao registrar custo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo custo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Registrar custo</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>Tipo</Label>
            <Select value={form.cost_type} onValueChange={(v) => setForm({ ...form, cost_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Constants.public.Enums.cost_type.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Provedor *</Label>
            <Input value={form.provider_name} onChange={(e) => setForm({ ...form, provider_name: e.target.value })} placeholder="RunPod, OpenAI, Gemini..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Quantidade</Label>
              <Input type="number" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div>
              <Label>Custo unitário</Label>
              <Input type="number" step="0.0001" value={form.unit_cost} onChange={(e) => setForm({ ...form, unit_cost: e.target.value })} />
            </div>
            <div>
              <Label>Moeda</Label>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} maxLength={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Salvando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
