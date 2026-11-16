import { Link } from "react-router-dom";
import { ArrowRight, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/constants/routePaths";

/** Placeholder for a module that is not built yet. Ported from old Seiyone pages/coming-soon.tsx. */
export function ComingSoonPage() {
  return (
    <div className="flex h-full min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-50 text-primary shadow-sm ring-1 ring-teal-100">
        <Wrench className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">Module in Development</h1>
      <p className="mb-8 max-w-sm text-muted-foreground">
        This area of Seiyone is currently being crafted for your workspace.
        Configuration options for this module can be set up in Settings.
      </p>
      <Button asChild variant="outline">
        <Link to={ROUTE_PATHS.settings}>
          Go to Settings
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
