/**
 * Response of GET /dashboard/summary.
 * Copied field for field from old Seiyone src/pages/Overview/dashboard/api.ts (DashboardSummary).
 * The old cards still guard against missing sections and keys, so the new cards keep those checks.
 */

/** Which cards the server allows this user to see. */
export interface DashboardVisibility {
  attention: boolean;
  today: boolean;
  operations: boolean;
  pipeline: boolean;
  occupancy: boolean;
  revenue: boolean;
}

export interface DashboardRevenueSource {
  source: string;
  amount: number;
  count: number;
}

export interface DashboardRevenue {
  queuedThisMonth: number;
  contractedMonthlyRecurring: number;
  currency: string;
  bySource: DashboardRevenueSource[];
}

/** One row of occupancy "By Floor" or "By Seat Type". */
export interface DashboardSeatBreakdown {
  id: number;
  name: string;
  total: number;
  occupied: number;
  percentage: number;
}

export interface DashboardReleasingSoon {
  clientId: number;
  clientName: string;
  exitDate: string;
  seatsReleasing: number;
}

export interface DashboardOccupancy {
  total: number;
  occupied: number;
  percentage: number;
  byFloor: DashboardSeatBreakdown[];
  bySeatType: DashboardSeatBreakdown[];
  releasingSoon: DashboardReleasingSoon[];
}

export interface DashboardAttentionCounts {
  pending_bookings: number;
  pending_employee_ids: number;
  access_reviews: number;
  contract_renewals: number;
  deposits_uncollected: number;
  missing_contract_documents: number;
  sla_breaches: number;
  work_orders_awaiting_verification: number;
  damage_incidents_awaiting: number;
  overdue_tasks: number;
  escalated_tasks: number;
  low_stock: number;
  uncollected_deliveries: number;
}

export interface DashboardToday {
  visitors_in_building: number;
  bookings_today: number;
  bookings_today_pending: number;
  tasks_due_today: number;
  open_tickets: number;
}

export interface DashboardPipelineStage {
  stage: string;
  count: number;
}

export interface DashboardPipeline {
  stages: DashboardPipelineStage[];
  quotesAwaiting: number;
  wonNotConverted: number;
}

export interface DashboardOperations {
  housekeepingScheduled: number;
  housekeepingCompleted: number;
  housekeepingOverdue: number;
  preventiveOpen: number;
  reactiveOpen: number;
  lowStock: number;
  assetsNeedRepair: number;
}

export interface DashboardSummary {
  visibility?: DashboardVisibility;
  generatedAt: string;
  scope?: "building" | "personal";
  audience?: "leadership" | "operations" | "personal";
  revenue: DashboardRevenue;
  occupancy: DashboardOccupancy;
  attentionCounts: DashboardAttentionCounts;
  today: DashboardToday;
  pipeline: DashboardPipeline;
  operations: DashboardOperations;
  renewalThresholdDays: number;
}
