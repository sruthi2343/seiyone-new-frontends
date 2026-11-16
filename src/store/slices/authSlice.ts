import type { AppSlice, AppState } from "@/app/store";
import {
  AUTH_PERMISSIONS_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  DEV_ROLE_STORAGE_KEY,
  FCM_TOKEN_STORAGE_KEY,
  SESSION_ID_STORAGE_KEY,
  SESSION_STORAGE_KEYS,
} from "@/constants/appConstants";
import { deleteFcmToken, getMe, logoutRequest } from "@/features/auth/api/authApi";
import { queryClient } from "@/lib/queryClient";
import { redirectToLogin } from "@/services/apiClient";
import type { LoginResponse, MeResponse, User } from "@/types/auth.types";

/**
 * Session state, ported from old Seiyone contexts/AuthContext.tsx (same storage keys, same rules).
 * Nothing here creates a user, token or permission: every value comes from storage or a server response.
 *
 * Two different "clear" operations, as in old Seiyone:
 * - resetSessionState: memory only (no stored token at start-up; the unauthorized event, whose handler already
 *   removed the storage keys).
 * - clearSession: memory and the 5 session storage keys (server rejected the session; sign-out).
 * Sign-in (POST /auth/login) and the welcome screen are added with the sign-in integration step.
 */

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

/** Old rule: the stored user / permissions only count while a token is stored too. */
function readStoredJson<T>(key: string, fallback: T): T {
  try {
    if (!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) return fallback;
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode); the session still works for this tab.
  }
}

function removeStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to remove when storage is unavailable.
  }
}

export interface AuthSlice {
  user: User | null;
  token: string | null;
  permissions: string[];
  /** True until the stored session has been checked with the server (old AuthContext starts true). */
  isLoading: boolean;
  /** True from a credential sign-in until the welcome screen finishes (old isWelcomeLoading). */
  isWelcomeLoading: boolean;

  /** Successful GET /auth/me: keep the token, refresh user and permissions (old fetchAuth). */
  applyMeResponse: (response: MeResponse) => void;
  /** Successful POST /auth/login: store token, session id, user, permissions and role; start the welcome screen (old login). */
  applyLoginResponse: (response: LoginResponse) => void;
  /** Session ended or invalid: forget it and remove its storage keys (old fetchAuth failure / handleUnauthorizedSession). */
  clearSession: () => void;
  /** Forget the session in memory only; storage is left as it is (old fetchAuth without token / unauthorized listener). */
  resetSessionState: () => void;
  setAuthLoading: (isLoading: boolean) => void;
  completeWelcomeLoading: () => void;

  /** Old fetchAuth: check the stored session with GET /auth/me. Runs at start-up and every 15 s while a token exists. */
  restoreSession: () => Promise<void>;
  /** Old logout: tell the server, forget the session (push token included), reload into the login page. */
  logout: () => void;
}

export const createAuthSlice: AppSlice<AuthSlice> = (set, get) => ({
  user: readStoredJson<User | null>(AUTH_USER_STORAGE_KEY, null),
  token: readStoredToken(),
  permissions: readStoredJson<string[]>(AUTH_PERMISSIONS_STORAGE_KEY, []),
  isLoading: true,
  isWelcomeLoading: false,

  applyMeResponse: ({ user, permissions }) => {
    // Old: data.permissions || [] (a null from the server becomes []).
    const grantedPermissions = permissions || [];
    writeStorage(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    writeStorage(AUTH_PERMISSIONS_STORAGE_KEY, JSON.stringify(grantedPermissions));
    set({ user, permissions: grantedPermissions }, false, "auth/applyMeResponse");
  },

  applyLoginResponse: ({ token, sessionId, user, permissions }) => {
    const grantedPermissions = permissions || [];
    if (token) writeStorage(AUTH_TOKEN_STORAGE_KEY, token);
    if (sessionId) writeStorage(SESSION_ID_STORAGE_KEY, sessionId);
    writeStorage(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    writeStorage(AUTH_PERMISSIONS_STORAGE_KEY, JSON.stringify(grantedPermissions));
    // Old: data.user?.role — no crash if the response has no user.
    if (user?.role) writeStorage(DEV_ROLE_STORAGE_KEY, user.role);
    set(
      // Old: if (data.token) setToken(...) — a missing, null or empty token keeps the previous one.
      (state) => ({ user, permissions: grantedPermissions, token: token || state.token, isWelcomeLoading: true }),
      false,
      "auth/applyLoginResponse",
    );
  },

  clearSession: () => {
    SESSION_STORAGE_KEYS.forEach(removeStorage);
    set({ user: null, token: null, permissions: [] }, false, "auth/clearSession");
  },

  resetSessionState: () => set({ user: null, token: null, permissions: [] }, false, "auth/resetSessionState"),

  setAuthLoading: (isLoading) => set({ isLoading }, false, "auth/setAuthLoading"),

  completeWelcomeLoading: () => set({ isWelcomeLoading: false }, false, "auth/completeWelcomeLoading"),

  // Old AuthContext.fetchAuth, lines 70-120.
  restoreSession: async () => {
    try {
      const currentToken = readStoredToken();
      if (!currentToken) {
        // No stored token: forget the session in memory only. Storage is not touched and no request is made.
        queryClient.clear();
        get().resetSessionState();
        return;
      }

      const response = await getMe(currentToken);

      if (response.ok) {
        get().applyMeResponse((await response.json()) as MeResponse);
      } else if (response.status !== 401) {
        // Session invalid or revoked.
        queryClient.clear();
        get().clearSession();
      }
      // A 401 is already handled by fetchWithSessionCheck → handleUnauthorizedSession: storage keys removed once,
      // the unauthorized event clears memory and the query cache, one redirect. Old Seiyone repeated the same
      // cleanup here; skipping it gives the same end state without a second cleanup.
    } catch (error) {
      // Network or parse failure: keep the stored session as it is (old behaviour).
      console.error("Failed to fetch auth session:", error);
    } finally {
      set({ isLoading: false }, false, "auth/restoreSession/done");
    }
  },

  // Old AuthContext.logout, lines 194-228 — same order.
  logout: () => {
    queryClient.clear();
    try {
      // Read before anything is removed; each request builds its headers from storage right now.
      const sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);
      const fcmToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

      if (fcmToken) {
        deleteFcmToken(fcmToken).catch(() => {});
      }
      logoutRequest(sessionId, fcmToken).catch(() => {});
    } catch {
      // Old Seiyone ignores any failure here; sign-out continues.
    }

    // Storage first (the push token only on a normal sign-out), then memory, then the login page.
    removeStorage(FCM_TOKEN_STORAGE_KEY);
    get().clearSession();
    redirectToLogin();
  },
});

/** Old AuthContext: signed in means a user and a token are both present. */
export const selectIsAuthenticated = (state: AppState) => Boolean(state.user && state.token);
