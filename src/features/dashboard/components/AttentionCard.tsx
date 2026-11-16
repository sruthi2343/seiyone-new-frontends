import { Link } from "react-router-dom";
import {
  AlertCircle,
  Banknote,
  Box,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSignature,
  FileWarning,
  Flame,
  KeyRound,
  ListX,
  PackageMinus,
  ShieldAlert,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routePaths";
import type { DashboardAttentionCounts } from "@/types/dashboard.types";

type AttentionItem = {
  key: keyof DashboardAttentionCounts;
  icon: LucideIcon;
  label: string;
  href: string;
  tint: "rose" | "amber";
};

/** "Needs Your Attention" — ported from old Seiyone attention-card.tsx (labels, links and order unchanged). */
export function AttentionCard({ data, threshold }: { data: DashboardAttentionCounts; threshold: number }) {
  const items: AttentionItem[] = [
    { key: "sla_breaches", icon: AlertCircle, label: "SLA breached tickets", href: `${ROUTE_PATHS.helpDesk}?view=tickets&sla=breached`, tint: "rose" },
    { key: "damage_incidents_awaiting", icon: ShieldAlert, label: "Damage incidents to review", href: `${ROUTE_PATHS.assetInventory}?tab=damage&status=awaiting`, tint: "rose" },
    { key: "escalated_tasks", icon: Flame, label: "Escalated tasks", href: `${ROUTE_PATHS.taskManagement}?view=list&escalated=true`, tint: "rose" },
    { key: "missing_contract_documents", icon: FileWarning, label: "Missing contract documents", href: `${ROUTE_PATHS.contractManagement}?view=contracts`, tint: "rose" },
    { key: "deposits_uncollected", icon: Banknote, label: "Uncollected deposits", href: `${ROUTE_PATHS.contractManagement}?view=alerts`, tint: "rose" },
    { key: "overdue_tasks", icon: ListX, label: "Overdue tasks", href: `${ROUTE_PATHS.taskManagement}?view=list&due=overdue`, tint: "rose" },

    { key: "pending_bookings", icon: CalendarClock, label: "Pending bookings", href: `${ROUTE_PATHS.bookings}?view=approvals`, tint: "amber" },
    { key: "pending_employee_ids", icon: UserCog, label: "Pending employee IDs", href: `${ROUTE_PATHS.clientManagement}?view=approvals`, tint: "amber" },
    { key: "access_reviews", icon: KeyRound, label: "Outstanding access reviews", href: `${ROUTE_PATHS.accessControl}?view=reviews&status=outstanding`, tint: "amber" },
    { key: "contract_renewals", icon: FileSignature, label: `Contracts renewing in ${threshold}d`, href: `${ROUTE_PATHS.contractManagement}?view=renewals`, tint: "amber" },
    { key: "work_orders_awaiting_verification", icon: ClipboardCheck, label: "Work orders to verify", href: `${ROUTE_PATHS.maintenance}?tab=work_orders&status=completed`, tint: "amber" },
    { key: "low_stock", icon: PackageMinus, label: "Low stock items", href: `${ROUTE_PATHS.assetInventory}?tab=consumables&stock=low`, tint: "amber" },
    { key: "uncollected_deliveries", icon: Box, label: "Uncollected deliveries", href: `${ROUTE_PATHS.visitorManagement}?view=deliveries&status=pending`, tint: "amber" },
  ];

  // Only counts above zero are listed.
  const activeItems = items.filter((item) => data[item.key] > 0);

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-50/50 p-6">
        <h2 className="text-base font-medium tracking-tight text-slate-900">Needs Your Attention</h2>
      </div>

      {activeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-600">All clear</p>
          <p className="text-xs text-slate-400">Nothing requires your immediate attention right now.</p>
        </div>
      ) : (
        <div className="flex flex-col p-2">
          {activeItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className="group flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.tint === "rose" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}
                >
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 transition-colors group-hover:text-slate-700">
                    {item.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-semibold ${item.tint === "rose" ? "text-rose-600" : "text-amber-600"}`}>
                  {data[item.key]}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
