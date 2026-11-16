import { useEffect, type ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ShieldOff } from "lucide-react";

import { useAppStore } from "@/app/store";
import { UNAUTHORIZED_EVENT } from "@/constants/appConstants";
import { ROUTE_PATHS } from "@/constants/routePaths";
import {
  canAccessModule,
  getModulePermissions,
  hasAnyPermission,
  homePath,
  isClientAccount,
  MODULE_PERMISSIONS,
} from "@/lib/moduleAccess";
import { queryClient } from "@/lib/queryClient";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

/**
 * Route guards, ported from old Seiyone App.tsx (Router + ProtectedRoute) and AuthContext.tsx.
 *
 * Development preview (decision D1): in `pnpm dev`, while there is NO session, protected pages open without a
 * permission check and show a label. As soon as a real session exists, every rule below is enforced, in dev too.
 * Production builds never contain the preview (import.meta.env.DEV is false there).
 */

/**
 * Signed-in state used by every guard.
 * The development preview is checked with `import.meta.env.DEV && !isAuthenticated` written directly at each use:
 * written that way the production build removes the preview code entirely (verified in dist/).
 */
function useSession() {
  const user = useAppStore((state) => state.user);
  const permissions = useAppStore((state) => state.permissions);
  const isAuthenticated = useAppStore(selectIsAuthenticated);
  return { user, permissions, isAuthenticated };
}

/** Old App.tsx:130-139 — shown on every URL while the stored session is being checked. */
function AppLoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        <p className="text-xs font-medium text-slate-600">Loading Seiyone ERP...</p>
      </div>
    </div>
  );
}

/** Old App.tsx:108-120. */
function AccessDenied({ role }: { role: string | undefined }) {
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Your role ({role || "User"}) does not have permission to access this module. Please contact your system administrator if you require access.
      </p>
    </div>
  );
}

/** Old App.tsx:91-103 — File Manager opened by a client-portal account. */
function AccessRestricted() {
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        File Manager is an internal management tool and is not available for client portal accounts.
      </p>
    </div>
  );
}

/** Development only (D1): marks pages opened without a session. Never rendered in production. */
function DevPreviewLabel() {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm">
      <ShieldOff className="h-3 w-3" />
      Auth not enforced · development preview
    </div>
  );
}

/**
 * Root of every route (old AuthProvider + Router start).
 * Checks the stored session once at start-up and every 15 s while a token exists, reacts to ended sessions,
 * and shows the loading screen until the first check finishes.
 */
export function SessionGate() {
  const isLoading = useAppStore((state) => state.isLoading);
  const token = useAppStore((state) => state.token);
  const restoreSession = useAppStore((state) => state.restoreSession);
  const resetSessionState = useAppStore((state) => state.resetSessionState);

  // Old AuthContext.tsx:126-136. Registered before the first check so a 401 from /auth/me lands here.
  useEffect(() => {
    const onUnauthorized = () => {
      queryClient.clear();
      resetSessionState();
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [resetSessionState]);

  // Old AuthContext.tsx:122-124 — once at start-up.
  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  // Old AuthContext.tsx:138-146 — every 15 s while a token exists; stops when the token is gone.
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      void restoreSession();
    }, 15000);
    return () => clearInterval(interval);
  }, [token, restoreSession]);

  if (isLoading) return <AppLoadingScreen />;
  return <Outlet />;
}

/** Old App.tsx:168-171 — signed-out users go to the login page. */
export function RequireAuth() {
  const { isAuthenticated } = useSession();
  if (isAuthenticated) return <Outlet />;
  if (import.meta.env.DEV) {
    return (
      <>
        <Outlet />
        <DevPreviewLabel />
      </>
    );
  }
  return <Navigate to={ROUTE_PATHS.login} />;
}

/** Old App.tsx:163-166 (location "/login") — signed-in users go to their home module. */
export function RedirectIfSignedIn() {
  const { user, permissions, isAuthenticated } = useSession();
  if (isAuthenticated) return <Navigate to={homePath(user, permissions)} />;
  return <Outlet />;
}

/** Old App.tsx:163-166 (location "/") — the home module. Development preview without a session: /dashboard. */
export function HomeRedirect() {
  const { user, permissions, isAuthenticated } = useSession();
  if (isAuthenticated) return <Navigate to={homePath(user, permissions)} />;
  return <Navigate to={ROUTE_PATHS.dashboard} replace />;
}

/**
 * Old App.tsx:74-124 (ProtectedRoute), same checks in the same order:
 * 1. client accounts never open File Manager → "Access Restricted" (lines 89-104);
 * 2. Task Management takes its permission list from getModulePermissions (line 106);
 * 3. Help Desk, Task Management and Settings also need canAccessModule (line 107);
 * 4. otherwise "Access Denied" unless the user has one of the listed permissions (line 107).
 * `href` is the module's route, needed for checks 1-3; pages without those special cases may omit it.
 */
export function RequirePermission({
  permissions: required,
  href,
  children,
}: {
  permissions: readonly string[];
  href?: string;
  children: ReactNode;
}) {
  const { user, permissions, isAuthenticated } = useSession();
  if (import.meta.env.DEV && !isAuthenticated) return <>{children}</>;

  if (href === ROUTE_PATHS.fileManager && isClientAccount(user)) return <AccessRestricted />;

  const requiredPermissions =
    href === ROUTE_PATHS.taskManagement ? (getModulePermissions(user, href) ?? required) : required;
  const needsModuleAccess =
    href === ROUTE_PATHS.helpDesk || href === ROUTE_PATHS.taskManagement || href === ROUTE_PATHS.settings;

  if (
    (needsModuleAccess && !canAccessModule(user, permissions, href)) ||
    (requiredPermissions.length > 0 && !hasAnyPermission(permissions, requiredPermissions))
  ) {
    return <AccessDenied role={user?.role} />;
  }
  return <>{children}</>;
}

/**
 * /dashboard: old App.tsx:163-166 sends users who cannot open the Dashboard to their home module instead,
 * then the page's own permission check applies (ProtectedRoute with MODULE_PERMISSIONS["/dashboard"]).
 */
export function DashboardGuard({ children }: { children: ReactNode }) {
  const { user, permissions, isAuthenticated } = useSession();
  const isDevPreview = import.meta.env.DEV && !isAuthenticated;
  if (!isDevPreview && !canAccessModule(user, permissions, ROUTE_PATHS.dashboard)) {
    return <Navigate to={homePath(user, permissions)} />;
  }
  return <RequirePermission permissions={MODULE_PERMISSIONS[ROUTE_PATHS.dashboard]}>{children}</RequirePermission>;
}
