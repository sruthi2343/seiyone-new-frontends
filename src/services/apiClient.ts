/**
 * HTTP layer: native fetch, ported from old Seiyone src/lib/api.ts.
 * Same API base, same localStorage keys, same request headers, same 401 handling.
 * No backend URL is configured: VITE_API_URL is unset, so requests go to "/api" (not proxied).
 */

import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  DEV_ROLE_STORAGE_KEY,
  SESSION_ID_STORAGE_KEY,
  SESSION_STORAGE_KEYS,
  UNAUTHORIZED_EVENT,
} from "@/constants/appConstants";

const configuredApiUrl: string = import.meta.env.VITE_API_URL || "/api";

export const API_BASE = configuredApiUrl.replace(/\/$/, "");

/** Full-page move to the login page (old Seiyone: window.location.href = "/login"), deploy sub-path included. */
export function redirectToLogin() {
  const loginPath = `${import.meta.env.BASE_URL}login`;
  if (window.location.pathname !== loginPath) {
    window.location.href = loginPath;
  }
}

let isHandlingUnauthorized = false;

/**
 * Old Seiyone handleUnauthorizedSession (lib/api.ts:8-28): runs once at a time, removes the 5 session keys
 * (not the push-notification token), tells the app (UNAUTHORIZED_EVENT → in-memory session cleared), then
 * after 100 ms reloads into the login page.
 */
export function handleUnauthorizedSession() {
  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  try {
    SESSION_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage unavailable: nothing stored to clear.
  }

  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));

  setTimeout(() => {
    isHandlingUnauthorized = false;
    redirectToLogin();
  }, 100);
}

/**
 * fetch() with old Seiyone's global rule (lib/api.ts:30-42): any 401 response, except from /auth/login,
 * ends the session. Every request of the app goes through here instead of patching window.fetch.
 */
export async function fetchWithSessionCheck(url: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, init);
  if (response.status === 401 && !url.includes("/auth/login")) {
    handleUnauthorizedSession();
  }
  return response;
}

/** Old Seiyone getAuthHeaders(): bearer token, dev role, session id and user id from localStorage. */
export function getAuthHeaders(customHeaders?: HeadersInit): Record<string, string> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const devRole = localStorage.getItem(DEV_ROLE_STORAGE_KEY);
  const sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);
  const headers: Record<string, string> = {};

  if (customHeaders) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, customHeaders);
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    if (devRole) {
      headers["x-dev-role"] = devRole;
    }
  }

  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (rawUser && token) {
    try {
      const user: unknown = JSON.parse(rawUser);
      if (user && typeof user === "object" && "id" in user && user.id) headers["x-user-id"] = String(user.id);
    } catch {
      // Stored user is not valid JSON: send no x-user-id, as old Seiyone did.
    }
  }

  return headers;
}

/**
 * fetch() against API_BASE with the auth headers and the 401 rule. `path` starts with "/" (e.g. "/dashboard/summary").
 * The headers are read from storage at call time, before any later sign-out removes them.
 */
export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetchWithSessionCheck(`${API_BASE}${path}`, { ...init, headers: getAuthHeaders(init.headers) });
}

/**
 * GET a JSON list the way old Seiyone's generated client did (lib/api-client-react/src/custom-fetch.ts:333-399),
 * for requests the old app made through it (e.g. /api/buildings, /api/roles):
 * - URL: the API base without a trailing "/api" (old main.tsx:16 setBaseUrl), then the full "/api/..." path;
 * - headers: `authorization: Bearer <token>` when a token is stored, and `x-dev-role` when stored (even without a
 *   token) — no x-session-id, no x-user-id;
 * - a failed response throws an Error carrying the HTTP `status`; a 401 also ends the session (fetchWithSessionCheck).
 */
export async function apiGet<T>(apiPath: string, signal?: AbortSignal): Promise<T> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) headers["authorization"] = `Bearer ${token}`;
  const devRole = localStorage.getItem(DEV_ROLE_STORAGE_KEY);
  if (devRole) headers["x-dev-role"] = devRole;

  let response: Response;
  try {
    response = await fetchWithSessionCheck(`${API_BASE.replace(/\/api$/, "")}${apiPath}`, { method: "GET", headers, signal });
  } catch (error) {
    // Old client: aborts are not failures; a dropped connection gets a plain message.
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error("Cannot reach the server. Check your connection and try again.", { cause: error });
  }

  if (!response.ok) {
    throw Object.assign(new Error(`GET ${apiPath} failed with status ${response.status}`), { status: response.status });
  }
  return (await response.json()) as T;
}
