import {
  Server,
  Layers,
  Brain,
  Compass,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Boxes,
  Activity,
  Gauge,
  CalendarClock,
  Calendar,
  ShieldCheck,
  Zap,
  LineChart,
  TrendingDown,
  MapPin,
  Award,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  ChevronRight,
  Quote,
  Sparkles,
  Code2,
  Cpu,
  Database,
  Cloud,
  Globe,
  Rocket,
  Workflow,
  GitBranch,
  Terminal,
  Network,
  CircuitBoard,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Explicit registry maps the icon-name strings that appear in the JSON data
 * (services.json, social.json, metrics.json, values.json, …) to lucide
 * components. Explicit (not dynamic Lucide[name]) so the bundle tree-shakes and
 * an unknown/typo'd name can never throw — it falls back to HelpCircle.
 *
 * Keys are normalized: lowercased with separators stripped, so "map-pin",
 * "MapPin" and "map_pin" all resolve.
 */
const REGISTRY: Record<string, LucideIcon> = {
  // services.json
  server: Server,
  layers: Layers,
  brain: Brain,
  compass: Compass,
  // social.json
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  mail: Mail,
  email: Mail,
  // metrics.json
  boxes: Boxes,
  activity: Activity,
  gauge: Gauge,
  calendarclock: CalendarClock,
  calendar: Calendar,
  // values.json
  shieldcheck: ShieldCheck,
  zap: Zap,
  linechart: LineChart,
  trendingdown: TrendingDown,
  // common UI / extras
  mappin: MapPin,
  award: Award,
  arrowright: ArrowRight,
  arrowupright: ArrowUpRight,
  externallink: ExternalLink,
  copy: Copy,
  check: Check,
  menu: Menu,
  close: X,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  chevrondown: ChevronDown,
  chevronright: ChevronRight,
  quote: Quote,
  sparkles: Sparkles,
  code: Code2,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  globe: Globe,
  rocket: Rocket,
  workflow: Workflow,
  gitbranch: GitBranch,
  terminal: Terminal,
  network: Network,
  circuitboard: CircuitBoard,
};

const normalize = (name?: string) => (name ?? '').trim().toLowerCase().replace(/[-_\s]/g, '');

/** Resolve an icon-name string to a lucide component, with a safe fallback. */
export function getIcon(name?: string): LucideIcon {
  return REGISTRY[normalize(name)] ?? HelpCircle;
}
