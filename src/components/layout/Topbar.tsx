import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Building2, Check, ChevronDown, LogOut, Menu, Shield, User as UserIcon } from "lucide-react";

import { useAppStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEV_ROLE_STORAGE_KEY } from "@/constants/appConstants";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { listRoles } from "@/features/auth/api/authApi";
import { useBuilding } from "@/features/buildings/hooks/useBuilding";
import { cn } from "@/lib/utils";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import type { User } from "@/types/auth.types";

/** Old Seiyone lib/role-options.ts — super-admin roles are not offered in the role switch (presentation only). */
function isVisibleRoleOption(role: { name?: string; label?: string }) {
  return ![role.name, role.label].some((value) =>
    ["superadmin", "superadministrator"].includes(String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
}

/** Old Topbar.tsx:26-59 — picks the building the whole app works with; hidden when there is none. */
function BuildingSwitcher() {
  const { buildings, building, setBuildingId } = useBuilding();
  if (!buildings.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex max-w-[11rem] cursor-pointer items-center gap-2 rounded-full border border-slate-200/80 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:max-w-[14rem]"
          title="Switch building"
        >
          <Building2 className="h-4 w-4 shrink-0 text-teal-600" />
          <span className="truncate">{building?.name}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl border border-slate-200 p-1.5 shadow-lg">
        <DropdownMenuLabel className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Building
        </DropdownMenuLabel>
        {buildings.map((b) => (
          <DropdownMenuItem
            key={b.id}
            onClick={() => setBuildingId(b.id)}
            className={cn("cursor-pointer rounded-lg text-xs", b.id === building?.id && "bg-teal-50 font-semibold text-teal-700")}
          >
            <Check className={cn("mr-2 h-3.5 w-3.5 text-teal-600", b.id !== building?.id && "invisible")} />
            <span className="truncate">{b.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Old Topbar.tsx:62-203 — the signed-in user's menu. Rendered only when a real user exists (D3). */
function UserMenu({ user }: { user: User }) {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore(selectIsAuthenticated);
  const logout = useAppStore((state) => state.logout);
  const restoreSession = useAppStore((state) => state.restoreSession);

  const { data } = useQuery({
    queryKey: ["/api/roles"],
    queryFn: ({ signal }) => listRoles(signal),
    enabled: isAuthenticated,
  });
  const roles = Array.isArray(data) ? data : [];

  // Old lines 67-75: starts from the stored dev role, then follows user.role whenever it changes.
  const [activeRole, setActiveRole] = useState(
    () => user.role || localStorage.getItem(DEV_ROLE_STORAGE_KEY) || "System Admin",
  );
  const [syncedUserRole, setSyncedUserRole] = useState(user.role);
  if (user.role !== syncedUserRole) {
    setSyncedUserRole(user.role);
    if (user.role) setActiveRole(user.role);
  }

  // Old lines 77-81 (development only, D10).
  const handleRoleChange = async (role: string) => {
    setActiveRole(role);
    localStorage.setItem(DEV_ROLE_STORAGE_KEY, role);
    await restoreSession();
  };

  // Old lines 83-86.
  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.login);
  };

  const currentRoleLabel = roles.find((r) => r.name === activeRole)?.label || user.role || activeRole;
  const userInitial = (user.displayName || user.name || user.username || "A").charAt(0).toUpperCase();
  const displayName = user.displayName || user.name || "System User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-200/80 p-1.5 pl-2.5 text-left transition-colors hover:bg-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white shadow-xs">
              {userInitial}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs leading-tight font-semibold text-slate-900">{displayName}</p>
              <p className="text-[10px] font-medium text-teal-700">{currentRoleLabel}</p>
            </div>
          </div>
          <ChevronDown className="mr-1 h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border border-slate-200 p-1.5 shadow-lg">
        <div className="px-3 py-2">
          <p className="truncate text-xs font-semibold text-slate-900">{displayName}</p>
          <p className="truncate font-mono text-[11px] text-slate-500">@{user.username || "user"}</p>
          {user.email && <p className="mt-0.5 truncate text-[11px] text-slate-400">{user.email}</p>}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate(ROUTE_PATHS.profile)}
          className="cursor-pointer rounded-lg text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
        >
          <UserIcon className="mr-2 h-3.5 w-3.5 text-teal-600" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Development only (D10): never rendered, nor bundled, in production. */}
        {import.meta.env.DEV && (
          <>
            <DropdownMenuLabel className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Switch Role (Dev)
            </DropdownMenuLabel>
            {roles.filter(isVisibleRoleOption).map((role) => (
              <DropdownMenuItem
                key={role.id}
                onClick={() => void handleRoleChange(role.name)}
                className={cn("cursor-pointer rounded-lg text-xs", activeRole === role.name && "bg-teal-50 font-semibold text-teal-700")}
              >
                <Shield className="mr-2 h-3.5 w-3.5 text-teal-600" />
                {role.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Old Seiyone components/layout/Topbar.tsx:93-208. Search and notifications are deferred (no placeholders). */
export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const user = useAppStore((state) => state.user);

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5 text-slate-600" />
      </Button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <BuildingSwitcher />
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}
