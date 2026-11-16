import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routePaths";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { ProportionBar } from "@/features/dashboard/components/ProportionBar";
import { formatUnderscoredLabel } from "@/features/dashboard/utils/dashboardUtils";
import type { DashboardPipeline } from "@/types/dashboard.types";

/** "Sales Pipeline" — ported from old Seiyone pipeline-card.tsx. */
export function PipelineCard({ data }: { data: DashboardPipeline }) {
  const totalStages = data.stages?.reduce((total, stage) => total + stage.count, 0) || 0;

  return (
    <DashboardSection
      title="Sales Pipeline"
      action={
        <Link to={ROUTE_PATHS.crm} className="flex items-center gap-1 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-700">
          View CRM <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <Link to={`${ROUTE_PATHS.crm}?view=pipeline&stage=quote_sent`} className="flex flex-col rounded-xl bg-neutral-50 p-4 transition-colors hover:bg-neutral-100">
            <span className="mb-1 text-xl font-semibold text-neutral-900">{data.quotesAwaiting || 0}</span>
            <span className="text-xs font-medium text-neutral-500">Quotes Awaiting</span>
          </Link>
          <Link to={`${ROUTE_PATHS.crm}?view=pipeline&stage=won`} className="flex flex-col rounded-xl bg-neutral-50 p-4 transition-colors hover:bg-neutral-100">
            <span className="mb-1 text-xl font-semibold text-neutral-600">{data.wonNotConverted || 0}</span>
            <span className="text-xs font-medium text-neutral-500">Won, Not Converted</span>
          </Link>
        </div>

        {data.stages && data.stages.length > 0 && (
          <div className="flex flex-col gap-3">
            <Link to={`${ROUTE_PATHS.crm}?view=pipeline`} className="mb-1 flex items-center justify-between text-xs font-semibold tracking-wider text-neutral-500 uppercase hover:text-neutral-700">
              <span>Active Pipeline</span>
              <span>{totalStages} leads</span>
            </Link>
            <div className="flex flex-col gap-2">
              {data.stages.map((stage, index) => (
                <Link key={index} to={`${ROUTE_PATHS.crm}?view=pipeline&stage=${stage.stage}`} className="group flex cursor-pointer flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-700 capitalize transition-colors group-hover:text-neutral-900">
                      {formatUnderscoredLabel(stage.stage)}
                    </span>
                    <span className="font-medium text-neutral-900">{stage.count}</span>
                  </div>
                  <ProportionBar
                    percentage={totalStages > 0 ? (stage.count / totalStages) * 100 : 0}
                    trackClassName="h-1.5"
                    fillClassName="bg-neutral-200 group-hover:bg-neutral-300"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardSection>
  );
}
