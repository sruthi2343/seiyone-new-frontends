/** Shown while a lazily loaded page is fetched. Ported from old Seiyone components/page-loading.tsx. */
export function PageLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-3 text-sm text-teal-700">
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none"
        />
        Loading module...
      </div>
      <div aria-hidden="true" className="space-y-6 animate-pulse motion-reduce:animate-none">
        <div className="space-y-3">
          <div className="h-7 w-56 rounded bg-slate-200" />
          <div className="h-4 w-2/3 max-w-lg rounded bg-slate-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 rounded-2xl border bg-card" />
          ))}
        </div>
        <div className="space-y-5 rounded-2xl border bg-card p-6">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-8 rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
