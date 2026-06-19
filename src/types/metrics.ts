export interface Metric {
  id: string;
  value: number; // numeric target for the count-up
  suffix?: string; // "+", "%", "K+", "M+"
  prefix?: string; // "$", "~"
  decimals?: number;
  label: string;
  icon?: string;
  context?: string;
}

export interface MetricsData {
  heading: string;
  eyebrow?: string;
  items: Metric[];
}
