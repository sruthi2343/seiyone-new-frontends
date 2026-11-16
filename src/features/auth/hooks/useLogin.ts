import { useMutation } from "@tanstack/react-query";

import type { LoginCredentials } from "@/features/auth/schemas/login.schema";

export const LOGIN_PENDING_MESSAGE = "Sign-in isn't available yet. The Seiyone server is not connected.";

/**
 * Sign-in mutation used by the login form.
 *
 * TODO(auth – backend pending): replace the mutation function with the Zustand auth store's login,
 *   which will call POST /auth/login through the fetch wrapper (old Seiyone AuthContext behaviour:
 *   store token / session id / user / permissions, then go to "/" and show the welcome screen).
 *   Until the backend is confirmed this sends no request, stores nothing and never navigates.
 */
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<void> => {
      void credentials;
      throw new Error(LOGIN_PENDING_MESSAGE);
    },
  });
}
