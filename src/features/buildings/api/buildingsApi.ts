import { apiGet } from "@/services/apiClient";
import type { Building } from "@/types/building.types";

/** GET /api/buildings — old Seiyone listBuildings (generated api.ts:1921-1941). */
export function listBuildings(signal?: AbortSignal): Promise<Building[]> {
  return apiGet<Building[]>("/api/buildings", signal);
}
