import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useAppStore } from "@/app/store";
import { PageLoading } from "@/components/common/PageLoading";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useBuilding } from "@/features/buildings/hooks/useBuilding";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

/**
 * App shell for signed-in pages, matching old Seiyone components/layout.tsx:
 * a full-height row where only <main> scrolls.
 */
export default function AppLayout() {
  const { pathname } = useLocation();
  const isAuthenticated = useAppStore(selectIsAuthenticated);
  const { isLoading: isBuildingsLoading } = useBuilding();

  // Mobile menu state stays local (D7). It is open only for the page it was opened on, so any navigation closes it
  // (old Sidebar.tsx:169-171 closed it whenever the location changed).
  const [sidebarOpenOn, setSidebarOpenOn] = useState<string | null>(null);

  // Old BuildingContext.tsx:49 — pages wait until the signed-in user's buildings are known.
  if (isAuthenticated && isBuildingsLoading) return null;

  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpenOn === pathname} onClose={() => setSidebarOpenOn(null)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onOpenSidebar={() => setSidebarOpenOn(pathname)} />

        <main className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain">
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
