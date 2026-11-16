import { cn } from "@/lib/utils";

/** Track + fill bar used by Sales Pipeline stages and Occupancy (old Seiyone markup). */
export function ProportionBar({
  percentage,
  trackClassName,
  fillClassName,
}: {
  percentage: number;
  /** Height of the track, e.g. "h-1.5". */
  trackClassName: string;
  /** Fill colours, e.g. "bg-neutral-200 group-hover:bg-neutral-300". */
  fillClassName: string;
}) {
  return (
    <div className={cn("flex w-full overflow-hidden rounded-full bg-neutral-100", trackClassName)}>
      <div className={cn("h-full rounded-full transition-all", fillClassName)} style={{ width: `${percentage}%` }} />
    </div>
  );
}
