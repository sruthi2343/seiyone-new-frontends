import { useSearchParams } from "react-router-dom";

import { useAppStore } from "@/app/store";
import { useBuilding } from "@/features/buildings/hooks/useBuilding";
import { AttentionCard } from "@/features/dashboard/components/AttentionCard";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import {
  DashboardLoading,
  DashboardNoAccess,
  DashboardUnavailable,
  StaleSummaryNotice,
} from "@/features/dashboard/components/DashboardStates";
import { OccupancyCard } from "@/features/dashboard/components/OccupancyCard";
import { OperationsCard } from "@/features/dashboard/components/OperationsCard";
import { PipelineCard } from "@/features/dashboard/components/PipelineCard";
import { RevenueCard } from "@/features/dashboard/components/RevenueCard";
import { TodayCard } from "@/features/dashboard/components/TodayCard";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";
import { getGreeting } from "@/features/dashboard/utils/dashboardUtils";

/** Dashboard — ported from old Seiyone src/pages/Overview/dashboard/index.tsx. */
export default function DashboardPage() {
  // The signed-in user (null without a session: then only the development sample can show).
  const user = useAppStore((state) => state.user);
  // The building chosen in the Topbar switcher (null without a session or without buildings).
  const { buildingId } = useBuilding();
  const [searchParams] = useSearchParams();

  const { data, isLoading, isError, isFetching, refetch, isSample, sampleMarker } = useDashboardSummary({
    userId: user?.id,
    role: user?.role,
    buildingId,
    sampleScenario: searchParams.get("sample"),
  });
  const greeting = getGreeting(new Date().getHours());

  if (isLoading || (!data && !isError)) return <DashboardLoading />;
  if (!data) return <DashboardUnavailable onRetry={() => void refetch()} />;

  const visibility = data.visibility;

  return (
    <div data-sample={sampleMarker} className="min-h-full bg-slate-50 p-4 pb-12 font-sans sm:p-6 lg:p-8">
      <div className="w-full min-w-0">
        <DashboardHeader greeting={greeting} generatedAt={data.generatedAt} isFetching={isFetching} isSample={isSample} />

        {isError && <StaleSummaryNotice />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {(visibility?.attention || visibility?.today) && (
            <div className="order-1 flex min-w-0 flex-col gap-6 lg:col-span-4">
              {visibility?.attention && <AttentionCard data={data.attentionCounts} threshold={data.renewalThresholdDays} />}
              {visibility?.today && <TodayCard data={data.today} />}
            </div>
          )}
          {(visibility?.operations || visibility?.pipeline) && (
            <div className="order-2 flex min-w-0 flex-col gap-6 lg:col-span-4">
              {visibility?.operations && <OperationsCard data={data.operations} />}
              {visibility?.pipeline && data.pipeline && <PipelineCard data={data.pipeline} />}
            </div>
          )}
          {(visibility?.occupancy || visibility?.revenue) && (
            <div className="order-3 flex min-w-0 flex-col gap-6 lg:col-span-4">
              {visibility?.occupancy && data.occupancy && <OccupancyCard data={data.occupancy} />}
              {visibility?.revenue && data.revenue && <RevenueCard data={data.revenue} />}
            </div>
          )}
        </div>

        {visibility && !Object.values(visibility).some(Boolean) && (
          <DashboardNoAccess name={user?.name || user?.username} />
        )}
      </div>
    </div>
  );
}
