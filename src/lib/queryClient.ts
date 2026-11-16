import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { handleUnauthorizedSession } from "@/services/apiClient";

/** Reads an HTTP status from an error thrown by the API layer, if it has one. */
function errorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const { status, statusCode } = error as { status?: unknown; statusCode?: unknown };
  const value = status ?? statusCode;
  return typeof value === "number" ? value : undefined;
}

/** Old Seiyone's 401 test (query-client.ts:23-28): status / statusCode 401, or "401" / "Unauthorized" in the message. */
function isUnauthorizedError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { status, statusCode, message } = error as { status?: unknown; statusCode?: unknown; message?: unknown };
  return (
    status === 401 ||
    statusCode === 401 ||
    (typeof message === "string" && (message.includes("401") || message.includes("Unauthorized")))
  );
}

/**
 * Query defaults copied from the old Seiyone app (src/lib/query-client.ts).
 * TODO(contracts module): old Seiyone also refreshes every contract query after a successful mutation.
 */
export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isUnauthorizedError(error)) handleUnauthorizedSession();
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isUnauthorizedError(error)) handleUnauthorizedSession();
    },
    // Any successful change can move dashboard numbers, so the summary is always refreshed (old Seiyone).
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // Retrying a 4xx (e.g. authorization) only delays the actionable error.
      retry: (failureCount, error) => {
        const status = errorStatus(error);
        if (status !== undefined && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});
