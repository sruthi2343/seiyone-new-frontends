import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Shown until the first summary arrives (old Seiyone dashboard/index.tsx). */
export function DashboardLoading() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-slate-50 p-12 font-sans">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <p className="text-sm font-medium tracking-wide">Gathering your morning briefing...</p>
      </div>
    </div>
  );
}

/** Shown when no summary could be loaded at all. */
export function DashboardUnavailable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-medium text-slate-900">Briefing unavailable</h2>
        <p className="text-sm text-slate-500">
          We couldn't load your dashboard summary. Please ensure you are connected to the network.
        </p>
        <Button variant="outline" onClick={onRetry} className="mt-4 gap-2 border-slate-200 text-slate-600">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}

/** Shown above the cards when a refresh failed but an earlier summary is still displayed. */
export function StaleSummaryNotice() {
  return (
    <p role="alert" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
      Updates are temporarily unavailable. Showing the last successful summary; retrying automatically.
    </p>
  );
}

/** Shown when the server allows none of the six cards for this account. */
export function DashboardNoAccess({ name }: { name: string | undefined }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="font-semibold">Welcome, {name}</h2>
      <p className="mt-2 text-sm text-slate-500">
        Use the sidebar to open your assigned work. Your account has no access to organization-wide dashboard summaries.
      </p>
    </div>
  );
}
