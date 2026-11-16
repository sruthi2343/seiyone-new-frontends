import { FlaskConical, RefreshCw } from "lucide-react";

import { formatTime } from "@/features/dashboard/utils/dashboardUtils";

const DASHBOARD_DESCRIPTION = "Here is your operational overview";

/** Greeting, "as of" time and the Syncing pill from old Seiyone dashboard/index.tsx. */
export function DashboardHeader({
  greeting,
  generatedAt,
  isFetching,
  isSample,
}: {
  greeting: string;
  generatedAt: string;
  isFetching: boolean;
  isSample: boolean;
}) {
  return (
    <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{greeting}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {DASHBOARD_DESCRIPTION} as of {formatTime(generatedAt)}.
        </p>
      </div>

      {/* Development only: never rendered (nor bundled) in production builds. */}
      {import.meta.env.DEV && isSample && (
        <span className="flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
          <FlaskConical className="h-3 w-3" />
          Sample data · backend not connected
        </span>
      )}

      {isFetching && (
        <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-400 shadow-xs">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Syncing
        </div>
      )}
    </header>
  );
}
