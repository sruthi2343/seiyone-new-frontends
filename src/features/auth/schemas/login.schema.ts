import { z } from "zod";

/** Messages and rules from old Seiyone src/pages/auth/LoginPage.tsx. */
export const loginSchema = z.object({
  // Trimmed before checking and sending, like the old page.
  username: z.string().trim().min(1, "Please enter your username or email."),
  // Not trimmed: the old page only rejects an empty password.
  password: z.string().min(1, "Please enter your password."),
});

export type LoginCredentials = z.output<typeof loginSchema>;

/** Shown when a sign-in attempt fails without its own message (old Seiyone fallback text). */
export const LOGIN_FAILED_MESSAGE = "Invalid username or password. Please try again.";
