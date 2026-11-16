import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/constants/routePaths";

/** Unknown URLs. Ported from old Seiyone pages/not-found.tsx. */
export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-200 text-slate-500 shadow-sm">
        <span className="text-3xl font-bold tracking-tighter">404</span>
      </div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">Page Not Found</h1>
      <p className="mb-8 max-w-sm text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild variant="outline">
        <Link to={ROUTE_PATHS.home}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
