/**
 * Module access rules, ported unchanged from old Seiyone:
 *   lib/module-access.ts · lib/client-navigation.ts · hooks/use-permissions.ts · shared/permissions.ts (lines 128-213).
 * No rule here is new. Keys stay as old-Seiyone URL strings so each block can be compared with its source.
 */
import type { User } from "@/types/auth.types";

type MaybeUser = User | null | undefined;

// ── shared/permissions.ts:128-163 ────────────────────────────────────────────────────────────────────────────────
/** Modules whose tabs each need their own permission; the module opens only if at least one tab is allowed. */
export const MODULE_TAB_DEFINITIONS: Record<string, { group: string; module: string; tabs: Record<string, [key: string, label: string]> }> = {
  "/access-control": { group: "Access Control", module: "ACCESS_CONTROL", tabs: {
    dashboard: ["VIEW_ACCESS_CONTROL_DASHBOARD", "Dashboard"], credentials: ["VIEW_ACCESS_CONTROL_CREDENTIALS", "Credentials"],
    zones: ["VIEW_ACCESS_CONTROL_ZONES", "Zones"], rules: ["VIEW_ACCESS_CONTROL_RULES", "Access Rules"],
    devices: ["VIEW_ACCESS_CONTROL_DEVICES", "Devices"], events: ["VIEW_ACCESS_CONTROL_LEDGER", "Ledger"],
    reviews: ["VIEW_ACCESS_CONTROL_REVIEWS", "Reviews"], temp: ["VIEW_ACCESS_CONTROL_TEMPORARY", "Temporary Access"],
    reports: ["VIEW_ACCESS_CONTROL_REPORTS", "Reports"], audit: ["VIEW_ACCESS_CONTROL_AUDIT_TRAIL", "Audit Trail"],
  } },
  "/visitor-management": { group: "Visitor Management", module: "VISITORS", tabs: {
    dashboard: ["VIEW_VISITORS_DASHBOARD", "Dashboard"], reception: ["VIEW_VISITORS_RECEPTION", "Reception Desk"],
    "pre-register": ["VIEW_VISITORS_PRE_REGISTER", "Pre-register"], live: ["VIEW_VISITORS_LIVE_ROSTER", "Live Roster"],
    expected: ["VIEW_VISITORS_EXPECTED", "Expected Today"], approvals: ["VIEW_VISITORS_APPROVALS", "Approvals"],
    vehicles: ["VIEW_VISITORS_VEHICLES", "Vehicles & Parking"], deliveries: ["VIEW_VISITORS_DELIVERIES", "Deliveries"],
    blacklist: ["VIEW_VISITORS_BLACKLIST", "Blacklist"], reports: ["VIEW_VISITORS_REPORTS", "Reports"],
    settings: ["VIEW_VISITORS_SETTINGS", "Settings"],
  } },
  "/asset-inventory": { group: "Asset", module: "INVENTORY", tabs: {
    register: ["VIEW_ASSET_INVENTORY_REGISTER", "Register"],
    depreciation: ["VIEW_ASSET_INVENTORY_DEPRECIATION", "Depreciation"], labels: ["VIEW_ASSET_INVENTORY_QR_LABELS", "QR Labels"],
    damage: ["VIEW_ASSET_INVENTORY_DAMAGE", "Damage Incidents"], consumables: ["VIEW_ASSET_INVENTORY_CONSUMABLES", "Consumables"],
    supply: ["VIEW_ASSET_INVENTORY_SUPPLY_REQUESTS", "Supply Requests"], audits: ["VIEW_ASSET_INVENTORY_AUDITS", "Physical Audits"],
    reports: ["VIEW_ASSET_INVENTORY_REPORTS", "Reports"],
  } },
  "/vendor-management": { group: "Vendor Management", module: "VENDORS", tabs: {
    Categories: ["VIEW_VENDOR_MANAGEMENT_CATEGORIES", "Categories"], Vendors: ["VIEW_VENDOR_MANAGEMENT_VENDORS", "Vendors"],
    Inventory: ["VIEW_VENDOR_MANAGEMENT_INVENTORY", "Inventory"], AMC: ["VIEW_VENDOR_MANAGEMENT_AMC", "AMC"], Setup: ["VIEW_VENDOR_MANAGEMENT_SETUP", "Setup"],
  } },
  "/purchase": { group: "Purchase", module: "PURCHASE", tabs: {
    "Purchase Requests": ["VIEW_PURCHASE_REQUESTS", "Purchase Requests"], "Purchase Orders": ["VIEW_PURCHASE_ORDERS", "Purchase Orders"], "Goods Receipts": ["VIEW_PURCHASE_GRNS", "Goods Receipts (GRN)"],
    Invoices: ["VIEW_PURCHASE_INVOICES", "Invoices"], "Purchase Returns": ["VIEW_PURCHASE_RETURNS", "Purchase Returns"],
  } },
  "/crew": { group: "Crew Management", module: "CREW_MANAGEMENT", tabs: {
    crew: ["VIEW_CREW_TAB_DIRECTORY", "Workforce Directory"], profile: ["VIEW_CREW_TAB_PROFILE", "Staff Profile"],
    shifts: ["VIEW_CREW_TAB_ATTENDANCE", "Attendance"], leave: ["VIEW_CREW_TAB_LEAVE", "Leave"],
    claims: ["VIEW_CREW_TAB_CLAIMS", "Claims"], ots: ["VIEW_CREW_TAB_OVERTIME", "OTs"],
    deductions: ["VIEW_CREW_TAB_DEDUCTIONS", "Deductions"], bonus: ["VIEW_CREW_TAB_BONUS", "Bonus"],
    payroll: ["VIEW_CREW_TAB_PAYROLL", "Payroll"],
  } },
};

// ── shared/permissions.ts:183-190 ────────────────────────────────────────────────────────────────────────────────
export const BOOKING_TAB_ACCESS: Record<string, string[]> = {
  calendar: ["VIEW_BOOKINGS_CALENDAR"],
  queue: ["VIEW_BOOKINGS_QUEUE"],
  list: ["VIEW_BOOKINGS_LIST"],
  rooms: ["VIEW_BOOKINGS_ROOMS"],
  allowances: ["VIEW_BOOKINGS_ALLOWANCES"],
  reports: ["VIEW_BOOKINGS_REPORTS"],
};

// ── shared/permissions.ts:203-212 ────────────────────────────────────────────────────────────────────────────────
export const HOUSEKEEPING_TAB_ACCESS: Record<string, string[]> = {
  supervisor: ["VIEW_HOUSEKEEPING_BOARD"],
  today: ["VIEW_HOUSEKEEPING_MY_TASKS"],
  templates: ["VIEW_HOUSEKEEPING_CHECKLISTS"],
  schedules: ["VIEW_HOUSEKEEPING_SCHEDULES"],
  staff: ["VIEW_HOUSEKEEPING_STAFF"],
  qr: ["PRINT_HOUSEKEEPING_QR"],
  locations: ["VIEW_HOUSEKEEPING_LOCATIONS"],
  reports: ["VIEW_HOUSEKEEPING_REPORTS"],
};

// ── lib/module-access.ts:4-125 ───────────────────────────────────────────────────────────────────────────────────
/** Permissions that open each module (any one of them is enough). */
export const MODULE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard": ["VIEW_DASHBOARD"],
  "/crm": ["LIST_CLIENTS", "READ_CLIENT", "CREATE_CLIENT"],
  "/client-management": ["LIST_CLIENTS", "READ_CLIENT", "UPDATE_CLIENT"],
  "/bookings": ["LIST_MEETINGS", "MANAGE_MEETINGS", "LIST_CALLS", "MANAGE_CALLS"],
  "/access-control": ["READ_VAULT_CREDENTIAL", "CREATE_VAULT_CREDENTIAL", "REVEAL_VAULT_CREDENTIAL", "ACCESS_CLIENT_REVIEW"],
  "/asset-inventory": ["LIST_INVENTORY_ASSETS", "READ_INVENTORY_ASSET", "VIEW_ASSETS"],
  "/inventory-management": ["LIST_INVENTORY_ASSETS", "READ_INVENTORY_ASSET", "VIEW_ASSETS"],
  "/housekeeping": ["LIST_TASKS_ALL", "LIST_TASKS_ASSIGNED"],
  "/maintenance": ["LIST_TASKS_ALL", "VIEW_ASSETS"],
  "/vendor-management": [
    "LIST_VENDORS", "MANAGE_VENDOR_DIRECTORY", "VIEW_VENDOR_PURCHASES", "MANAGE_VENDOR_PURCHASES", "RECORD_VENDOR_PAYMENTS",
    "MANAGE_VENDOR_CATEGORIES", "MANAGE_VENDOR_SETUP", "MANAGE_VENDOR_ITEMS", "VIEW_VENDOR_MANAGEMENT_AMC", "MANAGE_VENDOR_AMC",
  ],
  "/purchase": ["VIEW_PURCHASE_REQUESTS", "VIEW_PURCHASE_ORDERS", "VIEW_PURCHASE_GRNS", "VIEW_PURCHASE_INVOICES", "VIEW_PURCHASE_RETURNS"],
  "/crew": ["LIST_CREW_MEMBERS", "READ_CREW_MEMBER"],
  "/visitor-management": ["LIST_USERS", "LIST_CREW_MEMBERS"],
  "/help-desk": ["VIEW_OWN_HELP_DESK_TICKETS", "VIEW_HELP_DESK", "VIEW_HELP_DESK_REPORTS", "PRINT_HELP_DESK_QR", "MANAGE_HELP_DESK_SETTINGS"],
  "/contract-management": ["LIST_PURCHASES", "READ_PURCHASE", "LIST_VENDORS", "LIST_CLIENTS", "VIEW_CLIENT_FINANCIALS"],
  "/task-management": ["LIST_TASKS_ALL", "LIST_TASKS_ASSIGNED", "CREATE_TASK"],
  "/file-manager": [
    "UPLOAD_FILES", "READ_UPLOAD_DOCUMENTS", "READ_UPLOAD_BRANDING", "READ_UPLOAD_ASSETS", "READ_UPLOAD_CONTENT",
    "READ_UPLOAD_VAULT", "VIEW_ASSET_LINKS", "EXPORT_FILE_ARCHIVE", "IMPORT_FILE_ARCHIVE",
  ],
  "/client-documents": [],
  "/billing-sales": ["LIST_INVOICES", "CREATE_INVOICE", "LIST_QUOTATIONS"],
  "/accounts": [
    "READ_ACCOUNTS_DASHBOARD", "READ_CHART_ACCOUNTS", "READ_ACCOUNTS_PAYABLE", "READ_ACCOUNTS_RECEIVABLE",
    "MANAGE_ACCOUNTS_PAYABLE", "APPROVE_DEBIT_NOTE", "READ_JOURNAL_ENTRIES",
  ],
  "/reports": ["READ_ACCOUNTS_DASHBOARD", "READ_FINANCIAL_STATEMENTS", "EXPORT_FINANCIAL_STATEMENTS", "VIEW_REPORT_CENTER"],
  "/settings": ["UPDATE_SETTINGS", "MANAGE_ROLES", "LIST_USERS", "MANAGE_ROLE_PERMISSIONS"],
};
// Old line 125: Housekeeping opens with any of its tab permissions.
MODULE_PERMISSIONS["/housekeeping"] = [...new Set(Object.values(HOUSEKEEPING_TAB_ACCESS).flat())];

// ── lib/client-navigation.ts ─────────────────────────────────────────────────────────────────────────────────────
/** Client-portal account (old heuristic, unchanged). */
export function isClientAccount(user: MaybeUser): boolean {
  if (typeof user?.isClientPortalUser === "boolean") return user.isClientPortalUser;
  if (typeof user?.personalProfile?.isClientPortalUser === "boolean") return user.personalProfile.isClientPortalUser;
  return String(user?.role ?? user?.roleName ?? user?.roleLabel ?? "").toLowerCase().includes("client") ||
    user?.isClientPortalUser === true || user?.personalProfile?.isClientPortalUser === true;
}

/** Landing page of a client account (staff accounts get /dashboard). */
export function accountHome(user: MaybeUser, permissions: readonly string[]): string {
  if (!isClientAccount(user)) return "/dashboard";
  if (permissions.some((key) => ["LIST_MEETINGS", "MANAGE_MEETINGS", "LIST_CALLS", "MANAGE_CALLS"].includes(key)) &&
    permissions.some((key) => ["VIEW_BOOKINGS_CALENDAR", "VIEW_BOOKINGS_LIST"].includes(key))) return "/bookings";
  if (permissions.some((key) => ["VIEW_HELP_DESK", "VIEW_OWN_HELP_DESK_TICKETS"].includes(key))) return "/help-desk";
  return "/client-documents";
}

// ── hooks/use-permissions.ts:11-14 ───────────────────────────────────────────────────────────────────────────────
/** True when `required` is empty or the user has at least one of its permissions. */
export function hasAnyPermission(permissions: readonly string[], required: readonly string[]): boolean {
  if (!required || required.length === 0) return true;
  return required.some((permission) => permissions.includes(permission));
}

// ── lib/module-access.ts:126-166 ─────────────────────────────────────────────────────────────────────────────────
const CLIENT_MODULES = new Set(["/bookings", "/help-desk", "/task-management", "/client-documents"]);

export function getModulePermissions(user: MaybeUser, href: string): string[] | undefined {
  if (isClientAccount(user) && href === "/help-desk") return ["VIEW_HELP_DESK", "VIEW_OWN_HELP_DESK_TICKETS"];
  if (isClientAccount(user) && href === "/task-management") return ["LIST_TASKS_ALL", "LIST_TASKS_ASSIGNED"];
  return MODULE_PERMISSIONS[href];
}

export function canAccessModule(user: MaybeUser, permissions: readonly string[], href: string): boolean {
  if (href === "/task-management" && !permissions.includes(isClientAccount(user) ? "VIEW_CLIENT_TASKS" : "VIEW_TASK_MANAGEMENT")) return false;
  if (href === "/bookings" && !bookingTabs(user, permissions).length) return false;
  if (MODULE_TAB_DEFINITIONS[href] && !moduleTabs(permissions, href).length) return false;
  if (isClientAccount(user) && !CLIENT_MODULES.has(href)) return false;
  if (!isClientAccount(user) && href === "/client-documents") return false;
  const required = getModulePermissions(user, href);
  return !!required && (!required.length || required.some((key) => permissions.includes(key)));
}

// Sidebar order; staff without the Dashboard land on the first module they can open.
const STAFF_LANDING_ORDER = [
  "/dashboard", "/crm", "/client-management", "/bookings", "/access-control", "/inventory-management", "/asset-inventory", "/housekeeping",
  "/maintenance", "/vendor-management", "/purchase", "/crew", "/visitor-management", "/help-desk", "/contract-management",
  "/task-management", "/file-manager", "/billing-sales", "/accounts", "/reports", "/settings",
];

export function homePath(user: MaybeUser, permissions: readonly string[]): string {
  if (isClientAccount(user)) return accountHome(user, permissions);
  return STAFF_LANDING_ORDER.find((href) => canAccessModule(user, permissions, href)) ?? "/profile";
}

const CLIENT_BOOKING_TABS = new Set(["calendar", "list"]);

// Bookings tabs the account may open, in display order; client accounts never get staff-only tabs.
export function bookingTabs(user: MaybeUser, permissions: readonly string[]): string[] {
  return Object.entries(BOOKING_TAB_ACCESS)
    .filter(([tab, keys]) => (!isClientAccount(user) || CLIENT_BOOKING_TABS.has(tab)) && keys.some((key) => permissions.includes(key)))
    .map(([tab]) => tab);
}

// Tabs of a module the account may open, in display order (see MODULE_TAB_DEFINITIONS).
export function moduleTabs(permissions: readonly string[], href: string): string[] {
  const definition = MODULE_TAB_DEFINITIONS[href];
  if (!definition) return [];
  return Object.entries(definition.tabs).filter(([, [key]]) => permissions.includes(key)).map(([tab]) => tab);
}
