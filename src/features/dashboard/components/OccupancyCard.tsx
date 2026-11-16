import { Link } from "react-router-dom";
import { Building2, LogOut } from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routePaths";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { ProportionBar } from "@/features/dashboard/components/ProportionBar";
import { formatDate } from "@/features/dashboard/utils/dashboardUtils";
import type { DashboardOccupancy } from "@/types/dashboard.types";

/** "Occupancy" — ported from old Seiyone occupancy-card.tsx. */
export function OccupancyCard({ data }: { data: DashboardOccupancy }) {
  return (
    <DashboardSection
      title="Occupancy"
      action={
        <Link to={`${ROUTE_PATHS.clientManagement}?view=seat-allocation`} className="text-xl font-semibold tracking-tight text-neutral-600 hover:text-neutral-700">
          {data.percentage || 0}%
        </Link>
      }
    >
      <div className="flex flex-col gap-8 p-4">
        {/* Total Overview */}
        <Link to={`${ROUTE_PATHS.clientManagement}?view=seat-allocation`} className="group flex flex-col gap-2">
          <div className="mb-1 flex items-end justify-between">
            <span className="text-sm font-medium text-neutral-500">Total capacity</span>
            <span className="text-sm font-medium text-neutral-900 group-hover:text-neutral-700">
              {data.occupied || 0} <span className="text-neutral-400">/ {data.total || 0} seats</span>
            </span>
          </div>
          <ProportionBar percentage={data.percentage || 0} trackClassName="h-2.5" fillClassName="bg-neutral-500" />
        </Link>

        {/* By Floor */}
        {data.byFloor && data.byFloor.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-neutral-500">
              <Building2 className="h-7 w-7 shrink-0 rounded-lg bg-neutral-100 p-1.5 text-neutral-600" strokeWidth={1.5} />
              <h3 className="text-xs font-medium tracking-wider uppercase">By Floor</h3>
            </div>
            <div className="flex flex-col gap-3">
              {data.byFloor.map((floor) => (
                <Link key={floor.id} to={`${ROUTE_PATHS.clientManagement}?view=seat-allocation&floor=${floor.id}`} className="group flex cursor-pointer flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-700 transition-colors group-hover:text-neutral-600">{floor.name}</span>
                    <span className="text-xs font-medium text-neutral-500">
                      {floor.occupied} / {floor.total} seats · {floor.percentage || 0}%
                    </span>
                  </div>
                  <ProportionBar
                    percentage={floor.percentage || 0}
                    trackClassName="h-1.5"
                    fillClassName="bg-neutral-300 group-hover:bg-neutral-400"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {data.bySeatType && data.bySeatType.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4">
            <h3 className="text-xs font-medium tracking-wider text-neutral-500 uppercase">By Seat Type</h3>
            <div className="grid grid-cols-1 gap-2 @min-[26rem]:grid-cols-2">
              {data.bySeatType.map((type) => (
                <Link
                  key={type.id}
                  to={`${ROUTE_PATHS.clientManagement}?view=seat-allocation&type=${type.id}`}
                  className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-700">{type.name}</p>
                    <p className="text-xs text-neutral-400">
                      {type.occupied} of {type.total} seats
                    </p>
                  </div>
                  <span className="text-base font-semibold text-neutral-700">{type.percentage}%</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Releasing Soon */}
        {data.releasingSoon && data.releasingSoon.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-neutral-200 pt-4">
            <div className="mb-1 flex items-center gap-2 text-neutral-500">
              <LogOut className="h-7 w-7 shrink-0 rounded-lg bg-neutral-100 p-1.5 text-neutral-600" strokeWidth={1.5} />
              <h3 className="text-xs font-medium tracking-wider uppercase">Releasing Soon</h3>
            </div>
            <div className="flex flex-col gap-2">
              {data.releasingSoon.map((release, index) => (
                <Link
                  key={index}
                  to={ROUTE_PATHS.clientManagementDetail.replace(":id", encodeURIComponent(String(release.clientId)))}
                  className="group flex items-center justify-between rounded-xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-900 group-hover:text-neutral-700">{release.clientName}</span>
                    <span className="text-xs text-neutral-500">Exits {formatDate(release.exitDate)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-neutral-700">{release.seatsReleasing} seats</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardSection>
  );
}
