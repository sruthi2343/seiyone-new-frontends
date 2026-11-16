/**
 * Browser-storage keys and app events, verified in old Seiyone. The names must stay identical:
 * sessions saved by the old app keep working, and the backend reads the headers built from them.
 */

/** Bearer token (old contexts/AuthContext.tsx, lib/api.ts). */
export const AUTH_TOKEN_STORAGE_KEY = "seiyone_auth_token";
/** Signed-in user as JSON (old contexts/AuthContext.tsx, lib/api.ts). */
export const AUTH_USER_STORAGE_KEY = "seiyone_auth_user";
/** Permission keys as a JSON array (old contexts/AuthContext.tsx, lib/api.ts). */
export const AUTH_PERMISSIONS_STORAGE_KEY = "seiyone_auth_permissions";
/** Server session id, sent as x-session-id (old contexts/AuthContext.tsx, lib/api.ts). */
export const SESSION_ID_STORAGE_KEY = "seiyone_session_id";
/** Active role, sent as x-dev-role (old contexts/AuthContext.tsx, lib/api.ts, components/layout/Topbar.tsx). */
export const DEV_ROLE_STORAGE_KEY = "seiyone_dev_role";
/** Selected building id (old contexts/BuildingContext.tsx). */
export const BUILDING_ID_STORAGE_KEY = "seiyone_building_id";
/** Push-notification token, removed on sign-out (old contexts/AuthContext.tsx, hooks/use-fcm.ts). */
export const FCM_TOKEN_STORAGE_KEY = "seiyone_fcm_token";

/** Keys old Seiyone clears whenever a session ends (AuthContext fetchAuth / lib/api.ts handleUnauthorizedSession). */
export const SESSION_STORAGE_KEYS = [
  AUTH_USER_STORAGE_KEY,
  AUTH_PERMISSIONS_STORAGE_KEY,
  DEV_ROLE_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  SESSION_ID_STORAGE_KEY,
] as const;

/** Window event fired when the API reports an ended session (old lib/api.ts → AuthContext). */
export const UNAUTHORIZED_EVENT = "seiyone:unauthorized";
