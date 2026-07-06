import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label, value, delta, icon: Icon, hint, tone = "default", className,
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "brand" | "success" | "warning" | "info";
  className?: string;
}) {
  const toneIcon: Record<string, string> = {
    default: "text-muted-foreground bg-muted/60",
    brand: "text-primary bg-primary/10 ring-1 ring-primary/20",
    success: "text-success bg-success/10 ring-1 ring-success/20",
    warning: "text-warning bg-warning/10 ring-1 ring-warning/20",
    info: "text-info bg-info/10 ring-1 ring-info/20",
  };

  return (
    <div className={cn("premium-card group relative overflow-hidden rounded-2xl p-5", className)}>
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">{label}</div>
        {Icon && (
          <div className={cn("h-9 w-9 grid place-items-center rounded-xl transition-transform duration-500 group-hover:scale-105", toneIcon[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      {(typeof delta === "number" || hint) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {typeof delta === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium tabular-nums",
                delta >= 0 ? "text-success" : "text-destructive",
              )}
            >
              {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta >= 0 ? "+" : ""}{delta}%
            </span>
          )}
          {hint && <span className="text-muted-foreground/80">{hint}</span>}
        </div>
      )}
    </div>
  );
}
