import { DEV_ROLE_STORAGE_KEY, SESSION_ID_STORAGE_KEY } from "@/constants/appConstants";
import { API_BASE, apiFetch, apiGet, fetchWithSessionCheck } from "@/services/apiClient";
import type { Role } from "@/types/role.types";

/**
 * Auth requests, exactly as old Seiyone contexts/AuthContext.tsx sends them.
 * The session requests return the raw Response: the caller branches on ok / status the way the old code did.
 * listRoles goes through the old generated client's rules (apiGet) and returns the parsed list.
 * POST /auth/login is added with the sign-in integration step (the login form is still the honest stub).
 */

/**
 * GET /auth/me (old fetchAuth, lines 81-95). It builds its own headers — Bearer token, plus x-dev-role and
 * x-session-id when stored — and deliberately NOT getAuthHeaders(), so no x-user-id is sent.
 */
export function getMe(token: string): Promise<Response> {
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const activeRole = localStorage.getItem(DEV_ROLE_STORAGE_KEY);
  const sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);
  if (activeRole) headers["x-dev-role"] = activeRole;
  if (sessionId) headers["x-session-id"] = sessionId;
  return fetchWithSessionCheck(`${API_BASE}/auth/me`, { headers });
}

/** DELETE /notifications/fcm-token { token } (old logout, lines 200-206). */
export function deleteFcmToken(fcmToken: string): Promise<Response> {
  return apiFetch("/notifications/fcm-token", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: fcmToken }),
  });
}

/** GET /api/roles — old Seiyone listRoles (generated api.ts:4493-4513), used by the Topbar user menu. */
export function listRoles(signal?: AbortSignal): Promise<Role[]> {
  return apiGet<Role[]>("/api/roles", signal);
}

/** POST /auth/logout { sessionId, fcmToken } (old logout, lines 208-212). */
export function logoutRequest(sessionId: string | null, fcmToken: string | null): Promise<Response> {
  return apiFetch("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, fcmToken }),
  });
}
