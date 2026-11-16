/**
 * Route paths verified in the old Seiyone app (src/App.tsx and components/layout/Sidebar.tsx).
 * Only paths listed here may be linked to; pages are attached in app/router.tsx as modules are built.
 */
export const ROUTE_PATHS = {
  home: "/",
  login: "/login",

  // Overview
  dashboard: "/dashboard",
  crm: "/crm",
  clientManagement: "/client-management",
  clientManagementDetail: "/client-management/:id",

  // Operations
  bookings: "/bookings",
  accessControl: "/access-control",
  assetInventory: "/asset-inventory",
  housekeeping: "/housekeeping",
  maintenance: "/maintenance",
  vendorManagement: "/vendor-management",
  purchase: "/purchase",
  crew: "/crew",
  visitorManagement: "/visitor-management",
  helpDesk: "/help-desk",
  contractManagement: "/contract-management",
  taskManagement: "/task-management",
  fileManager: "/file-manager",
  clientDocuments: "/client-documents",

  // Finance
  billingSales: "/billing-sales",
  accounts: "/accounts",
  reports: "/reports",

  // System
  settings: "/settings",
  profile: "/profile",
  notifications: "/notifications",
} as const;
