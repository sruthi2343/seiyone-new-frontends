import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Briefcase,
  Building2,
  Calendar,
  CheckSquare,
  CreditCard,
  FileText,
  FolderOpen,
  Home,
  Key,
  LifeBuoy,
  PaintBucket,
  PieChart,
  Settings as SettingsIcon,
  ShoppingCart,
  UserCheck,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import { useAppStore } from "@/app/store";
import seiyoneLogo from "@/assets/images/seiyone-logo.png";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { canAccessModule, homePath, isClientAccount } from "@/lib/moduleAccess";
import { cn } from "@/lib/utils";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

type NavItem = { name: string; href: string; icon: LucideIcon };

/** Old Seiyone components/layout/Sidebar.tsx:31-153 — the 21 modules, groups, labels and icons unchanged. */
const NAVIGATION: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "CRM", href: "/crm", icon: Users },
      { name: "Client Management", href: "/client-management", icon: Briefcase },
    ],
  },
  {
    group: "Operations",
    items: [
      { name: "Bookings", href: "/bookings", icon: Calendar },
      { name: "Access Control", href: "/access-control", icon: Key },
      { name: "Asset", href: "/asset-inventory", icon: Box },
      { name: "Housekeeping", href: "/housekeeping", icon: PaintBucket },
      { name: "Maintenance", href: "/maintenance", icon: Wrench },
      { name: "Vendor Management", href: "/vendor-management", icon: Wrench },
      { name: "Purchase", href: "/purchase", icon: ShoppingCart },
      { name: "Crew", href: "/crew", icon: Users },
      { name: "Visitor Management", href: "/visitor-management", icon: UserCheck },
      { name: "Help Desk", href: "/help-desk", icon: LifeBuoy },
      { name: "Contract Management", href: "/contract-management", icon: FileText },
      { name: "Task Management", href: "/task-management", icon: CheckSquare },
      { name: "File Manager", href: "/file-manager", icon: FolderOpen },
      { name: "Documents & Notices", href: "/client-documents", icon: FileText },
    ],
  },
  {
    group: "Finance",
    items: [
      { name: "Billing & Sales", href: "/billing-sales", icon: CreditCard },
      { name: "Accounts", href: "/accounts", icon: Building2 },
      { name: "Reports", href: "/reports", icon: PieChart },
    ],
  },
  {
    group: "System",
    items: [{ name: "Settings", href: "/settings", icon: SettingsIcon }],
  },
];

/** Old Seiyone Sidebar.tsx:160-256: permission-filtered menu, static from `lg`, slide-in drawer below it. */
export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const user = useAppStore((state) => state.user);
  const permissions = useAppStore((state) => state.permissions);
  const isAuthenticated = useAppStore(selectIsAuthenticated);

  const isClientRole = isClientAccount(user);
  // Old Sidebar.tsx:165-167: an item shows when the user may open its module. Modules not built yet open old
  // Seiyone's "Module in Development" page (app/router.tsx).
  // Development preview without a session (D1/P1): there are no permissions to check, and the route guards let every
  // page open, so all 21 items are listed.
  const canSee = (href: string) => (import.meta.env.DEV && !isAuthenticated) || canAccessModule(user, permissions, href);
  const logoHref = isAuthenticated ? homePath(user, permissions) : ROUTE_PATHS.dashboard;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh min-h-0 w-72 flex-col border-r border-slate-200 bg-white shadow-sm transition-transform duration-300 lg:static lg:shrink-0 lg:translate-x-0",
          isOpen ? "flex translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-6">
          <Link to={logoHref} className="flex items-center gap-3 text-teal-600">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-100/80 bg-teal-50 p-1.5 shadow-xs">
              <img src={seiyoneLogo} alt="Seiyone logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-teal-800">Seiyone</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={onClose}>
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-4">
          <nav className="space-y-6 px-4">
            {NAVIGATION.map((group) => {
              const visibleItems = group.items.filter((item) => canSee(item.href));
              if (visibleItems.length === 0) return null;
              return (
                <div key={group.group}>
                  <h4 className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">{group.group}</h4>
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      // Exact match, as in old Seiyone (D8).
                      const isActive = pathname === item.href;
                      const displayName =
                        isClientRole && item.href === "/task-management" ? "Tasks & Deliverables" : item.name;

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50",
                            isActive ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:text-slate-900",
                          )}
                        >
                          <item.icon className={cn("h-4 w-4", isActive ? "text-teal-600" : "text-slate-400")} />
                          {displayName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
