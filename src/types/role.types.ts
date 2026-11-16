/**
 * A role, as returned by GET /roles — old generated api.schemas.ts `Role`.
 * `name` is a string, not the generated 8-value `RoleName` union: old Seiyone also handles role names outside
 * that list (lib/role-options.ts hides "super admin" variants; Topbar falls back to "System Admin").
 */
export interface Role {
  id: number;
  name: string;
  label: string;
}
