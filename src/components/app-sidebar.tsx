import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, UserCircle2, Package, Sparkles, Megaphone,
  Factory, FileVideo, Send, ClipboardCheck, Truck,
  BarChart3, Activity, Gauge, Brain, Lightbulb, Wallet,
  Settings, Cpu, Layers, LineChart, Zap, KeyRound,
} from "lucide-react";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "Visão",
    items: [{ title: "Dashboard Geral", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "Operação",
    items: [
      { title: "Meus Perfis", url: "/perfis", icon: UserCircle2 },
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Produtos", url: "/produtos", icon: Package },
      { title: "Avatares", url: "/avatares", icon: Sparkles },
      { title: "Campanhas", url: "/campanhas", icon: Megaphone },
      { title: "Formatos", url: "/formatos", icon: Layers },
    ],
  },
  {
    label: "Fábrica",
    items: [
      { title: "Produção", url: "/producao", icon: Factory },
      { title: "Criativos Finais", url: "/criativos", icon: FileVideo },
      { title: "Publicações", url: "/publicacoes", icon: Send },
      { title: "Aprovações Internas", url: "/aprovacoes", icon: ClipboardCheck },
      { title: "Entregas", url: "/entregas", icon: Truck },
    ],
  },
  {
    label: "Inteligência",
    items: [
      { title: "Dashboard de Performance", url: "/dashboard-performance", icon: LineChart },
      { title: "Resultados", url: "/resultados", icon: BarChart3 },
      { title: "Diagnóstico de Conversão", url: "/diagnostico", icon: Activity },
      { title: "Menor Esforço, Maior Venda", url: "/menor-esforco", icon: Gauge },
      { title: "Inteligência da Fábrica", url: "/inteligencia", icon: Brain },
      { title: "Recomendações", url: "/recomendacoes", icon: Lightbulb },
      { title: "Custos", url: "/custos", icon: Wallet },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Automações", url: "/automacoes", icon: Zap },
      { title: "Configurações", url: "/configuracoes", icon: Settings },
      { title: "Provedores de IA", url: "/configuracoes/provedores", icon: Cpu },
      { title: "Contas Gemini", url: "/configuracoes/gemini", icon: KeyRound },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[var(--gradient-brand)] grid place-items-center text-primary-foreground font-display font-bold shadow-[var(--shadow-elegant)]">
            VF
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold">Video Factory</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                AI TikTok Shop
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                {g.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        {!collapsed && (
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Modo interno
            </div>
            <div className="text-xs mt-1 text-foreground/80">
              Produzir → Publicar → Medir → Aprender → Repetir.
            </div>
          </div>
        )}
        <UserMenu collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}
