import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label, value, delta, icon: Icon, hint, tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "brand" | "success" | "warning" | "info";
}) {
  const toneRing: Record<string, string> = {
    default: "border-border",
    brand: "border-primary/40",
    success: "border-success/40",
    warning: "border-warning/40",
    info: "border-info/40",
  };
  const toneIcon: Record<string, string> = {
    default: "text-muted-foreground bg-muted/60",
    brand: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    info: "text-info bg-info/10",
  };

  return (
    <div
      className={cn(
        "group rounded-xl border bg-card/70 backdrop-blur p-4 transition hover:bg-card",
        toneRing[tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        {Icon && (
          <div className={cn("h-8 w-8 grid place-items-center rounded-lg", toneIcon[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              delta >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta >= 0 ? "+" : ""}{delta}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
