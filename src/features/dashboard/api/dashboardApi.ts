import { apiFetch } from "@/services/apiClient";
import type { DashboardSummary } from "@/types/dashboard.types";

/** GET /dashboard/summary[?buildingId=] — same request and error as old Seiyone dashboard/api.ts. */
export async function getDashboardSummary({
  buildingId,
  signal,
}: {
  buildingId: number | null;
  signal?: AbortSignal;
}): Promise<DashboardSummary> {
  const query = buildingId ? `?buildingId=${buildingId}` : "";
  const response = await apiFetch(`/dashboard/summary${query}`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch dashboard summary");
  return (await response.json()) as DashboardSummary;
}
