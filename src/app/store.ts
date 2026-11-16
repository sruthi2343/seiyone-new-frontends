import { create, type StateCreator } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import { createAuthSlice, type AuthSlice } from "@/store/slices/authSlice";
import { createBuildingSlice, type BuildingSlice } from "@/store/slices/buildingSlice";

/**
 * The single client-state store (Chakra pattern): one slice per concern.
 * Server data (buildings list, roles, dashboard summary) stays in TanStack Query, not here.
 */
export type AppState = AuthSlice & BuildingSlice;

type Middlewares = [["zustand/devtools", never], ["zustand/subscribeWithSelector", never]];

export type AppSlice<T> = StateCreator<AppState, Middlewares, [], T>;

export const useAppStore = create<AppState>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...createAuthSlice(...a),
      ...createBuildingSlice(...a),
    })),
    { name: "seiyone-app", enabled: import.meta.env.DEV },
  ),
);
