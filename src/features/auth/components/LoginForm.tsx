import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, UserRound } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoginTextField } from "@/features/auth/components/LoginTextField";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { LOGIN_FAILED_MESSAGE, loginSchema } from "@/features/auth/schemas/login.schema";

/**
 * Error box + sign-in form from old Seiyone's login card.
 * Returns two siblings (not one wrapper) so the card keeps the old space-evenly layout.
 */
export function LoginForm() {
  const login = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // One message at a time, username first — as on the old page.
    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message ?? LOGIN_FAILED_MESSAGE);
      return;
    }

    try {
      await login.mutateAsync(parsed.data);
      // TODO(auth – backend pending): on success old Seiyone navigates to "/" (welcome screen first).
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : LOGIN_FAILED_MESSAGE);
    }
  };

  return (
    <>
      {errorMessage && (
        <Alert className="mt-4 flex items-start gap-2 rounded-xl border-(color:--login-error-border) bg-(color:--login-error-bg) p-3 text-sm text-(color:--login-error-text)">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <LoginTextField
          id="login-username"
          label="Username or Email"
          icon={UserRound}
          type="text"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username or email"
          autoComplete="username"
        />

        <LoginTextField
          id="login-password"
          label="Password"
          icon={LockKeyhole}
          fieldClassName="mt-2.5"
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-(color:--login-icon) hover:text-(color:--login-icon-hover) focus-visible:outline-2 focus-visible:outline-(color:--login-toggle-focus)"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          }
        />

        <Button
          type="submit"
          disabled={login.isPending}
          className="mt-2.5 h-11 w-full gap-2.5 rounded-[9px] border border-(color:--login-submit-border) bg-(color:--login-submit) text-sm font-medium text-white shadow-(--login-submit-shadow) hover:bg-(color:--login-submit-hover) active:bg-(color:--login-submit-active) disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-60 max-md:h-[50px] max-md:text-base"
        >
          {login.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
