import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Card shell shared by Today's Activity, Operations, Sales Pipeline, Occupancy and Revenue Indicators
 * (identical markup in old Seiyone). Needs Your Attention has its own, different shell.
 */
export function DashboardSection({
  title,
  action,
  children,
}: {
  title: string;
  /** Right side of the header row (e.g. "View CRM", the occupancy %). */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="@container flex min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className={cn("border-b border-neutral-200 p-4", action && "flex items-center justify-between")}>
        <h2 className="text-base font-medium tracking-tight text-neutral-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
