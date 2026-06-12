import { type ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PageShell({
  title, description, actions, children, period = true,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  period?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-svh">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto, criativo, perfil, cliente…"
              className="pl-8 h-9 bg-muted/40 border-border"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {period && (
            <Select defaultValue="7d">
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="month">Mês atual</SelectItem>
                <SelectItem value="lifetime">Vida toda</SelectItem>
              </SelectContent>
            </Select>
          )}
          <button className="relative h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
        </div>
      </header>

      <div className="px-6 pt-6 pb-3 flex flex-col gap-1">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      <main className="px-6 pb-12 flex-1">{children}</main>
    </div>
  );
}
