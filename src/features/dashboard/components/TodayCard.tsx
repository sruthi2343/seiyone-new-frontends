import { Link } from "react-router-dom";
import { CalendarRange, CheckSquare, ChevronRight, Clock, LifeBuoy, Users, type LucideIcon } from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routePaths";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import type { DashboardToday } from "@/types/dashboard.types";

type TodayItem = { key: keyof DashboardToday; icon: LucideIcon; label: string; href: string };

const ITEMS: TodayItem[] = [
  { key: "visitors_in_building", icon: Users, label: "Visitors in building", href: `${ROUTE_PATHS.visitorManagement}?view=live` },
  { key: "bookings_today", icon: CalendarRange, label: "Bookings today", href: `${ROUTE_PATHS.bookings}?calendar&date=today` },
  { key: "bookings_today_pending", icon: Clock, label: "Pending bookings today", href: `${ROUTE_PATHS.bookings}?view=approvals` },
  { key: "tasks_due_today", icon: CheckSquare, label: "Tasks due today", href: `${ROUTE_PATHS.taskManagement}?view=list&due=today` },
  { key: "open_tickets", icon: LifeBuoy, label: "Open support tickets", href: `${ROUTE_PATHS.helpDesk}?view=tickets&status=open` },
];

/** "Today's Activity" — ported from old Seiyone today-card.tsx. A row appears only when its key is in the data. */
export function TodayCard({ data }: { data: DashboardToday }) {
  const items = ITEMS.filter((item) => Object.prototype.hasOwnProperty.call(data, item.key));

  return (
    <DashboardSection title="Today's Activity">
      <div className="flex flex-col p-2">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            className="group flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-neutral-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-transparent bg-neutral-100 text-neutral-500 transition-all group-hover:border-neutral-200 group-hover:bg-neutral-100">
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-neutral-700 transition-colors group-hover:text-neutral-900">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-neutral-900">{data[item.key] || 0}</span>
              <ChevronRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-neutral-400" />
            </div>
          </Link>
        ))}
      </div>
    </DashboardSection>
  );
}
