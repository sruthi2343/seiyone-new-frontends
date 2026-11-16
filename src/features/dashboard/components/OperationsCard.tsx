import { Link } from "react-router-dom";
import { Box, PaintBucket, Wrench } from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routePaths";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import type { DashboardOperations } from "@/types/dashboard.types";

/** Section heading with a framed icon, as in the old Operations card. */
function GroupHeading({ icon: Icon, label }: { icon: typeof Box; label: string }) {
  return (
    <div className="mb-1 flex items-center gap-2 text-neutral-500">
      <Icon className="h-7 w-7 shrink-0 rounded-lg bg-neutral-100 p-1.5 text-neutral-600" strokeWidth={1.5} />
      <h3 className="text-xs font-medium tracking-wider uppercase">{label}</h3>
    </div>
  );
}

/** "Operations" — ported from old Seiyone operations-card.tsx. Each group shows only when its first field exists. */
export function OperationsCard({ data }: { data: DashboardOperations }) {
  return (
    <DashboardSection title="Operations">
      <div className="grid grid-cols-1 gap-4 p-4">
        {/* Housekeeping */}
        {data.housekeepingScheduled !== undefined && (
          <div className="flex flex-col gap-3">
            <GroupHeading icon={PaintBucket} label="Housekeeping" />
            <div className="grid grid-cols-3 gap-2">
              <Link to={`${ROUTE_PATHS.housekeeping}?tab=supervisor&date=today`} className="flex flex-col rounded-xl bg-neutral-50 p-3 text-center transition-colors hover:bg-neutral-100">
                <span className="text-xl font-semibold text-neutral-900">{data.housekeepingScheduled || 0}</span>
                <span className="mt-1 text-xs font-medium text-neutral-500">Scheduled</span>
              </Link>
              <Link to={`${ROUTE_PATHS.housekeeping}?tab=supervisor&date=today&status=completed`} className="flex flex-col rounded-xl bg-neutral-50 p-3 text-center transition-colors hover:bg-neutral-100">
                <span className="text-xl font-semibold text-neutral-600">{data.housekeepingCompleted || 0}</span>
                <span className="mt-1 text-xs font-medium text-neutral-500">Completed</span>
              </Link>
              <Link to={`${ROUTE_PATHS.housekeeping}?tab=supervisor&date=today&status=overdue`} className="flex flex-col rounded-xl bg-neutral-50 p-3 text-center transition-colors hover:bg-neutral-50">
                <span className="text-xl font-semibold text-neutral-600">{data.housekeepingOverdue || 0}</span>
                <span className="mt-1 text-xs font-medium text-neutral-600">Overdue</span>
              </Link>
            </div>
          </div>
        )}

        {/* Maintenance */}
        {data.preventiveOpen !== undefined && (
          <div className="flex flex-col gap-3">
            <GroupHeading icon={Wrench} label="Work Orders" />
            <div className="grid grid-cols-1 gap-2">
              <Link to={`${ROUTE_PATHS.maintenance}?tab=work_orders&source=preventive`} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-100">
                <span className="text-sm font-medium text-neutral-700">Preventive Open</span>
                <span className="text-base font-semibold text-neutral-900">{data.preventiveOpen || 0}</span>
              </Link>
              <Link to={`${ROUTE_PATHS.maintenance}?tab=work_orders&source=reactive`} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-100">
                <span className="text-sm font-medium text-neutral-700">Reactive Open</span>
                <span className="text-base font-semibold text-neutral-900">{data.reactiveOpen || 0}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Assets & Inventory */}
        {data.lowStock !== undefined && (
          <div className="flex flex-col gap-3">
            <GroupHeading icon={Box} label="Inventory" />
            <div className="flex flex-col gap-2">
              <Link to={`${ROUTE_PATHS.assetInventory}?tab=consumables&stock=low`} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-50">
                <span className="text-sm font-medium text-neutral-800">Low stock items</span>
                <span className="text-base font-semibold text-neutral-600">{data.lowStock || 0}</span>
              </Link>
              <Link to={`${ROUTE_PATHS.assetInventory}?view=assets&condition=needs-repair`} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-100">
                <span className="text-sm font-medium text-neutral-700">Assets needing repair</span>
                <span className="text-base font-semibold text-neutral-900">{data.assetsNeedRepair || 0}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardSection>
  );
}
