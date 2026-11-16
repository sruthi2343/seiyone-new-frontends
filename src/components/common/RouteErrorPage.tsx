import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`.trim();
  if (error instanceof Error) return error.message;
  return "";
}

/**
 * Shown when a page throws while rendering or loading.
 * Same screen as old Seiyone components/error-boundary.tsx; as a React Router errorElement,
 * "Try again" reloads the page (which also recovers from a failed lazy-chunk download).
 */
export function RouteErrorPage() {
  const message = errorMessage(useRouteError());

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
        <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
        {message && <p className="text-sm">{message}</p>}
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-foreground/90"
      >
        Try again
      </button>
    </div>
  );
}
