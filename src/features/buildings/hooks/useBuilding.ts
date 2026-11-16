import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAppStore } from "@/app/store";
import { listBuildings } from "@/features/buildings/api/buildingsApi";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

/** Old Seiyone cache key (BuildingContext.tsx:29, generated getListBuildingsQueryKey). */
export const buildingKeys = {
  list: ["/api/buildings"] as const,
};

/**
 * The building the whole app works with — old Seiyone contexts/BuildingContext.tsx, same rules:
 * - the list is loaded only for signed-in users;
 * - the building in use is the remembered / chosen one if it is still in the list, otherwise the first;
 *   null only when there is no building;
 * - the building in use is remembered for next time.
 * Only the chosen id lives in Zustand (building slice); the list is TanStack Query server data.
 */
export function useBuilding() {
  const isAuthenticated = useAppStore(selectIsAuthenticated);
  const chosenId = useAppStore((state) => state.selectedBuildingId);
  const selectBuilding = useAppStore((state) => state.selectBuilding);
  const rememberBuilding = useAppStore((state) => state.rememberBuilding);

  const { data, isLoading } = useQuery({
    queryKey: buildingKeys.list,
    queryFn: ({ signal }) => listBuildings(signal),
    enabled: isAuthenticated,
    // Several components read this list (old Seiyone had one reader: the context provider). A failed request must
    // not be retried each time another reader mounts: AppLayout blanks the page while loading, which re-mounts
    // the readers and would request /api/buildings in an endless loop.
    retryOnMount: false,
  });

  // Old lines 30-35.
  const buildings = Array.isArray(data) ? data : [];
  const buildingId = buildings.some((b) => b.id === chosenId) ? chosenId : (buildings[0]?.id ?? null);
  const building = buildings.find((b) => b.id === buildingId) ?? null;

  // Old lines 37-44.
  useEffect(() => {
    if (buildingId == null) return;
    rememberBuilding(buildingId);
  }, [buildingId, rememberBuilding]);

  return { buildings, building, buildingId, setBuildingId: selectBuilding, isLoading };
}
