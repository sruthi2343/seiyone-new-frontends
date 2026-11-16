import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import {
  DashboardGuard,
  HomeRedirect,
  RedirectIfSignedIn,
  RequireAuth,
  RequirePermission,
  SessionGate,
} from "@/app/routeGuards";
import AppLayout from "@/components/layout/AppLayout";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { NotFoundPage } from "@/components/common/NotFoundPage";
import { RouteErrorPage } from "@/components/common/RouteErrorPage";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { MODULE_PERMISSIONS } from "@/lib/moduleAccess";

// Pages are lazy-loaded: each one downloads only when its URL is opened.
// (Fast Refresh cannot hot-swap a file that also exports `router`; this file simply reloads on edit.)
// eslint-disable-next-line react-refresh/only-export-components
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
// eslint-disable-next-line react-refresh/only-export-components
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));

/**
 * A module whose page is not built yet: old Seiyone's own "Module in Development" page, behind the module's old
 * ProtectedRoute check (App.tsx:74-124 with MODULE_PERMISSIONS[path]). Replace the route with the real page
 * when the module is built.
 */
const moduleInDevelopment = (path: string) => ({
  path,
  element: (
    <RequirePermission permissions={MODULE_PERMISSIONS[path]} href={path}>
      <ComingSoonPage />
    </RequirePermission>
  ),
});

/**
 * Every route of the app, in one place. Guards: see app/routeGuards.tsx (old Seiyone App.tsx behaviour).
 */
export const router = createBrowserRouter(
  [
    {
      // Session check, 15 s heartbeat and the "Loading Seiyone ERP..." screen for every URL.
      element: <SessionGate />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          // Public: signed-in users are sent to their home module.
          element: <RedirectIfSignedIn />,
          children: [
            {
              // Full screen, outside the app shell. No fallback: the page appears as soon as it loads.
              path: ROUTE_PATHS.login,
              element: (
                <Suspense fallback={null}>
                  <LoginPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          // Signed in only (development preview without a session: see routeGuards.tsx).
          element: <RequireAuth />,
          children: [
            {
              // App shell. Its <Suspense> shows "Loading module..." while a page downloads.
              element: <AppLayout />,
              children: [
                // Overview
                {
                  path: ROUTE_PATHS.dashboard,
                  element: (
                    <DashboardGuard>
                      <DashboardPage />
                    </DashboardGuard>
                  ),
                },
                moduleInDevelopment(ROUTE_PATHS.crm), // old App.tsx:201
                moduleInDevelopment(ROUTE_PATHS.clientManagement), // old App.tsx:205

                // Operations
                moduleInDevelopment(ROUTE_PATHS.bookings), // old App.tsx:210
                moduleInDevelopment(ROUTE_PATHS.accessControl), // old App.tsx:213
                moduleInDevelopment(ROUTE_PATHS.assetInventory), // old App.tsx:217
                moduleInDevelopment(ROUTE_PATHS.housekeeping), // old App.tsx:222
                moduleInDevelopment(ROUTE_PATHS.maintenance), // old App.tsx:225
                moduleInDevelopment(ROUTE_PATHS.vendorManagement), // old App.tsx:197
                moduleInDevelopment(ROUTE_PATHS.purchase), // old App.tsx:198
                moduleInDevelopment(ROUTE_PATHS.crew), // old App.tsx:234
                moduleInDevelopment(ROUTE_PATHS.visitorManagement), // old App.tsx:237
                moduleInDevelopment(ROUTE_PATHS.helpDesk), // old App.tsx:240 (also canAccessModule)
                moduleInDevelopment(ROUTE_PATHS.contractManagement), // old App.tsx:243
                moduleInDevelopment(ROUTE_PATHS.taskManagement), // old App.tsx:247 (getModulePermissions + canAccessModule)
                moduleInDevelopment(ROUTE_PATHS.fileManager), // old App.tsx:260 (client accounts: Access Restricted)
                // Old App.tsx:265 — Documents & Notices has no permission check, only sign-in.
                { path: ROUTE_PATHS.clientDocuments, element: <ComingSoonPage /> },

                // Finance (old App.tsx:250 — the module is still in development there too)
                {
                  path: ROUTE_PATHS.billingSales,
                  element: (
                    <RequirePermission permissions={MODULE_PERMISSIONS["/billing-sales"]}>
                      <ComingSoonPage />
                    </RequirePermission>
                  ),
                },
                moduleInDevelopment(ROUTE_PATHS.accounts), // old App.tsx:251
                moduleInDevelopment(ROUTE_PATHS.reports), // old App.tsx:253

                // System
                moduleInDevelopment(ROUTE_PATHS.settings), // old App.tsx:269 (also canAccessModule)

                // "/" → the user's home module (old App.tsx:163-166).
                { path: ROUTE_PATHS.home, element: <HomeRedirect /> },

                // Old Seiyone shows a Not Found page for unknown URLs (it does not redirect).
                { path: "*", element: <NotFoundPage /> },
              ],
            },
          ],
        },
      ],
    },
  ],
  // Old Seiyone can be deployed under a sub-path (Vite BASE_URL); keep links working there.
  { basename: import.meta.env.BASE_URL },
);
