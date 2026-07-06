import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, UserCircle2, Package, Sparkles, FileVideo, Send,
  Brain, Wallet, Settings, Cpu, KeyRound, Film, LogOut, Zap,
} from "lucide-react";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const groups = [
  {
    label: "Visão",
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "Fábrica",
    items: [
      { title: "Referências", url: "/referencias", icon: Film },
      { title: "Criativos", url: "/criativos", icon: FileVideo },
      { title: "Publicações", url: "/publicacoes", icon: Send },
    ],
  },
  {
    label: "Ativos",
    items: [
      { title: "Perfis", url: "/perfis", icon: UserCircle2 },
      { title: "Avatares", url: "/avatares", icon: Sparkles },
      { title: "Produtos", url: "/produtos", icon: Package },
    ],
  },
  {
    label: "Inteligência",
    items: [
      { title: "Inteligência", url: "/inteligencia", icon: Brain },
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
                Fábrica interna UGC
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
              Ciclo
            </div>
            <div className="text-xs mt-1 text-foreground/80">
              Mapear → Analisar → Produzir → Publicar → Aprender.
            </div>
          </div>
        )}
        <UserMenu collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };
  if (!user) return null;
  const initial = (user.email ?? "?").slice(0, 1).toUpperCase();
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-2">
      <div className="h-7 w-7 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">
        {initial}
      </div>
      {!collapsed && (
        <>
          <div className="flex-1 min-w-0">
            <div className="text-xs truncate">{user.email}</div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </>
      )}
    </div>
  );
}
