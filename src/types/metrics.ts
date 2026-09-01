export interface MetricDetailItem {
  /** What it is, e.g. "Vehicle Detection" or "Agentic QA pipeline". */
  name: string;
  /** The stack or make-up, e.g. "YOLOv8" or "6 agents - generation, reviewer, revisor". */
  note: string;
}

export interface MetricDetailGroup {
  /** Optional sub-heading when a breakdown has more than one grouping. */
  title?: string;
  items: MetricDetailItem[];
}

export interface MetricDetails {
  heading: string;
  intro?: string;
  groups: MetricDetailGroup[];
}

export interface Metric {
  id: string;
  value: number; // numeric target for the count-up
  suffix?: string; // "+", "%", "K+", "M+"
  prefix?: string; // "$", "~"
  decimals?: number;
  label: string;
  icon?: string;
  context?: string;
  /** Optional breakdown, shown in a modal when the tile is activated. */
  details?: MetricDetails;
}

export interface MetricsData {
  heading: string;
  eyebrow?: string;
  items: Metric[];
}
