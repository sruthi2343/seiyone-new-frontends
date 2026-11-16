/**
 * DEVELOPMENT-ONLY SAMPLE DATA — not real Seiyone data.
 *
 * Loaded only through the import.meta.env.DEV-gated dynamic import in useDashboardSummary, so production
 * builds never contain this file (verified after every build by searching dist/ for the marker below).
 * Shape: the verified DashboardSummary type. Values are made up and visibly labelled "Sample".
 * Only verified enum values are used: CRM LeadStage keys (old generated api.schemas.ts) and the
 * "Bookings" revenue source (the only source name in the old dashboard code).
 */
import type { DashboardSummary } from "@/types/dashboard.types";

export const DASHBOARD_SAMPLE_MARKER = "seiyone-dashboard-sample-data-7f3a";

export type DashboardSample = { summary: DashboardSummary; marker: string };

/** `?sample=` values for checking each dashboard state in the browser. Anything else shows the full sample. */
type SampleScenario = "full" | "all-clear" | "no-access" | "unavailable" | "loading";

const SCENARIOS: SampleScenario[] = ["all-clear", "no-access", "unavailable", "loading"];

const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

function fullSample(): DashboardSummary {
  return {
    visibility: { attention: true, today: true, operations: true, pipeline: true, occupancy: true, revenue: true },
    generatedAt: new Date().toISOString(),
    revenue: {
      queuedThisMonth: 184500,
      contractedMonthlyRecurring: 1245000,
      currency: "INR",
      bySource: [{ source: "Bookings", amount: 184500, count: 12 }],
    },
    occupancy: {
      total: 240,
      occupied: 186,
      percentage: 78,
      byFloor: [
        { id: 1, name: "Sample Floor 1", total: 120, occupied: 102, percentage: 85 },
        { id: 2, name: "Sample Floor 2", total: 120, occupied: 84, percentage: 70 },
      ],
      bySeatType: [
        { id: 1, name: "Sample Seat Type A", total: 140, occupied: 118, percentage: 84 },
        { id: 2, name: "Sample Seat Type B", total: 100, occupied: 68, percentage: 68 },
      ],
      releasingSoon: [
        { clientId: 101, clientName: "Sample Client A", exitDate: daysFromNow(18), seatsReleasing: 12 },
        { clientId: 102, clientName: "Sample Client B", exitDate: daysFromNow(41), seatsReleasing: 6 },
      ],
    },
    // Some counts are 0 on purpose: the card must hide them.
    attentionCounts: {
      sla_breaches: 2,
      damage_incidents_awaiting: 0,
      escalated_tasks: 1,
      missing_contract_documents: 3,
      deposits_uncollected: 0,
      overdue_tasks: 4,
      pending_bookings: 5,
      pending_employee_ids: 0,
      access_reviews: 2,
      contract_renewals: 3,
      work_orders_awaiting_verification: 1,
      low_stock: 6,
      uncollected_deliveries: 2,
    },
    today: {
      visitors_in_building: 37,
      bookings_today: 14,
      bookings_today_pending: 3,
      tasks_due_today: 22,
      open_tickets: 9,
    },
    pipeline: {
      stages: [
        { stage: "new_enquiry", count: 8 },
        { stage: "contacted", count: 6 },
        { stage: "tour_scheduled", count: 4 },
        { stage: "quote_sent", count: 5 },
        { stage: "negotiation", count: 3 },
      ],
      quotesAwaiting: 5,
      wonNotConverted: 2,
    },
    operations: {
      housekeepingScheduled: 48,
      housekeepingCompleted: 31,
      housekeepingOverdue: 4,
      preventiveOpen: 7,
      reactiveOpen: 5,
      lowStock: 6,
      assetsNeedRepair: 3,
    },
    renewalThresholdDays: 30,
  };
}

function toScenario(value: string | null): SampleScenario {
  return SCENARIOS.find((scenario) => scenario === value) ?? "full";
}

/** Resolves (or, for "unavailable" / "loading", fails or never settles) like the real request would. */
export function getDashboardSample(value: string | null): Promise<DashboardSample> {
  const scenario = toScenario(value);
  const summary = fullSample();

  switch (scenario) {
    case "loading":
      return new Promise<DashboardSample>(() => {});
    case "unavailable":
      return Promise.reject(new Error("Sample scenario: dashboard summary unavailable"));
    case "all-clear": {
      const counts = summary.attentionCounts;
      for (const key of Object.keys(counts) as Array<keyof typeof counts>) counts[key] = 0;
      break;
    }
    case "no-access":
      summary.visibility = { attention: false, today: false, operations: false, pipeline: false, occupancy: false, revenue: false };
      break;
    case "full":
      break;
  }

  return Promise.resolve({ summary, marker: DASHBOARD_SAMPLE_MARKER });
}
