import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "@/features/dashboard/api/dashboardApi";
import type { DashboardSample } from "@/features/dashboard/mocks/dashboardSummary.mock";

export const dashboardKeys = {
  /** Old Seiyone key prefix; invalidated after every successful mutation (lib/queryClient.ts). */
  all: ["dashboard-summary"] as const,
  summary: (userId: number | undefined, role: string | undefined, buildingId: number | null) =>
    [...dashboardKeys.all, userId, role, buildingId] as const,
  /** Separate root so sample data never shares the real summary's cache. */
  sample: (scenario: string | null) => ["dashboard-sample", scenario] as const,
};

/** Development-only sample. In production builds this function is just `return null` (DEV is false). */
async function loadDashboardSample(scenario: string | null): Promise<DashboardSample | null> {
  if (!import.meta.env.DEV) return null;
  const { getDashboardSample } = await import("@/features/dashboard/mocks/dashboardSummary.mock");
  return getDashboardSample(scenario);
}

type Options = {
  userId: number | undefined;
  role: string | undefined;
  buildingId: number | null;
  /** `?sample=` value; only read in development. */
  sampleScenario: string | null;
};

/**
 * Dashboard summary with two separate queries:
 * - real: old Seiyone's query — runs only when a signed-in user exists, polls every 10 s;
 * - sample: development only, and only while nobody is signed in. Never creates a user or session.
 */
export function useDashboardSummary({ userId, role, buildingId, sampleScenario }: Options) {
  const real = useQuery({
    queryKey: dashboardKeys.summary(userId, role, buildingId),
    queryFn: ({ signal }) => getDashboardSummary({ buildingId, signal }),
    enabled: Boolean(userId),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    // Also picks up direct API writes, other users' changes and time-based alerts (old Seiyone).
    refetchInterval: 10_000,
  });

  const showSample = import.meta.env.DEV && !userId;
  const sample = useQuery({
    queryKey: dashboardKeys.sample(sampleScenario),
    queryFn: () => loadDashboardSample(sampleScenario),
    enabled: showSample,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (showSample) {
    return {
      data: sample.data?.summary,
      isLoading: sample.isLoading,
      isError: sample.isError,
      isFetching: false,
      refetch: sample.refetch,
      isSample: true,
      sampleMarker: sample.data?.marker,
    };
  }

  return {
    data: real.data,
    isLoading: real.isLoading,
    isError: real.isError,
    isFetching: real.isFetching,
    refetch: real.refetch,
    isSample: false,
    sampleMarker: undefined,
  };
}
