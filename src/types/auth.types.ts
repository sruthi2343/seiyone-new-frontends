/**
 * Auth types, from old Seiyone. Nothing here is invented: each field is declared or read by the old app.
 */

/**
 * Signed-in user — old contexts/AuthContext.tsx `User`.
 * The fields after `includeInCrew` are not in that interface but are read by old lib/client-navigation.ts
 * and App.tsx (ProtectedRoute) to recognise client-portal accounts, so they are optional here.
 */
export interface User {
  id: number;
  username?: string;
  name?: string;
  displayName?: string;
  email: string;
  role?: string;
  phone?: string;
  status?: string;
  departments?: string[];
  includeInCrew?: boolean;

  roleName?: string;
  roleLabel?: string;
  isClientPortalUser?: boolean;
  clientId?: number;
  clientName?: string;
  personalProfile?: {
    isClientPortalUser?: boolean;
    clientId?: number;
    clientName?: string;
  };
}

/** Body of a successful POST /auth/login — the fields old AuthContext.login reads. */
export interface LoginResponse {
  token?: string;
  sessionId?: string;
  user: User;
  permissions?: string[];
}

/** Body of a successful GET /auth/me — the fields old AuthContext.fetchAuth reads. */
export interface MeResponse {
  user: User;
  permissions?: string[];
}

/** Error body of a failed POST /auth/login — old AuthContext shows `error`, then `message`. */
export interface LoginErrorResponse {
  error?: string;
  message?: string;
}
