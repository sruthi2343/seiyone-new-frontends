import type { AppSlice } from "@/app/store";
import { BUILDING_ID_STORAGE_KEY } from "@/constants/appConstants";

/**
 * Building choice, ported from old Seiyone contexts/BuildingContext.tsx.
 *
 * Only the user's choice lives here. The building list is server data (GET /buildings, TanStack Query), and the
 * building actually used is resolved against that list where it is loaded — the chosen one if it still exists,
 * otherwise the first — and then remembered with `rememberBuilding` (old rule). That hook arrives with the layout.
 */

/** Old storedBuildingId(): a positive whole number, or nothing. */
function readStoredBuildingId(): number | null {
  try {
    const id = Number(localStorage.getItem(BUILDING_ID_STORAGE_KEY));
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export interface BuildingSlice {
  /** The building the user picked, or the one remembered from last time. */
  selectedBuildingId: number | null;
  /** Topbar switcher: pick a building (old setBuildingId). */
  selectBuilding: (id: number) => void;
  /** Remember the building in use for next time (old BuildingContext effect). */
  rememberBuilding: (id: number) => void;
}

export const createBuildingSlice: AppSlice<BuildingSlice> = (set) => ({
  selectedBuildingId: readStoredBuildingId(),

  selectBuilding: (id) => set({ selectedBuildingId: id }, false, "building/selectBuilding"),

  rememberBuilding: (id) => {
    try {
      localStorage.setItem(BUILDING_ID_STORAGE_KEY, String(id));
    } catch {
      // Storage can be unavailable (private mode); the selection still works for this session.
    }
  },
});
