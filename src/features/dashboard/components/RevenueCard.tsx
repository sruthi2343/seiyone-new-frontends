import { Link } from "react-router-dom";
import { Info } from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routePaths";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { formatCurrency, formatUnderscoredLabel } from "@/features/dashboard/utils/dashboardUtils";
import type { DashboardRevenue } from "@/types/dashboard.types";

/** Old Seiyone rule: Bookings charges link to Bookings; every other source links to asset damage charges. */
function sourceHref(source: string): string {
  return source === "Bookings"
    ? `${ROUTE_PATHS.bookings}?view=billable-charges&status=queued&month=current`
    : `${ROUTE_PATHS.assetInventory}?tab=damage&charge=queued&month=current`;
}

/** "Revenue Indicators" — ported from old Seiyone revenue-card.tsx. */
export function RevenueCard({ data }: { data: DashboardRevenue }) {
  const money = (value: number) => formatCurrency(value, data.currency);

  return (
    <DashboardSection title="Revenue Indicators">
      <div className="flex flex-col gap-8 p-4">
        <div className="grid grid-cols-1 gap-3 @min-[26rem]:grid-cols-2">
          {/* Same-page jump to the "Queued By Source" list, as in the old card. */}
          <a href="#queued-charge-sources" className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:bg-neutral-100">
            <span className="mb-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">Queued This Month</span>
            <span className="text-xl font-semibold tracking-tight break-all text-neutral-900 tabular-nums">{money(data.queuedThisMonth)}</span>
          </a>
          <Link to={`${ROUTE_PATHS.contractManagement}?view=contracts&status=active`} className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:bg-neutral-50">
            <span className="mb-2 text-xs font-medium tracking-wider text-neutral-600 uppercase">Contracted MRR</span>
            <span className="text-xl font-semibold tracking-tight break-all text-neutral-700 tabular-nums">{money(data.contractedMonthlyRecurring)}</span>
          </Link>
        </div>

        {data.bySource && data.bySource.length > 0 && (
          <div id="queued-charge-sources" className="flex scroll-mt-6 flex-col gap-3">
            <h3 className="text-xs font-medium tracking-wider text-neutral-500 uppercase">Queued By Source</h3>
            <div className="flex flex-col gap-2">
              {data.bySource.map((source, index) => (
                <Link
                  key={index}
                  to={sourceHref(source.source)}
                  className="-mx-2 flex items-center justify-between rounded-lg border-b border-neutral-200 px-2 py-2 transition-colors last:border-0 hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-700 capitalize">{formatUnderscoredLabel(source.source)}</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-400">{source.count} items</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">{money(source.amount)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-4 text-xs text-neutral-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
          <p className="leading-relaxed">
            Billed, collected, and outstanding figures will populate when the external invoicing module is connected.
          </p>
        </div>
      </div>
    </DashboardSection>
  );
}
