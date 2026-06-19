/**
 * Parse a stat string from the data ("99.9%", "500K+", "20+", "3+") into the
 * numeric target + display suffix + decimal precision the count-up needs.
 */
export interface ParsedStat {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
}

export function parseStat(raw: string): ParsedStat {
  const match = raw.match(/^([^\d-]*)(-?\d[\d,]*\.?\d*)(.*)$/);
  if (!match) {
    return { value: 0, prefix: '', suffix: raw, decimals: 0 };
  }
  const [, prefix, numberPart, suffix] = match;
  const normalized = numberPart.replace(/,/g, '');
  const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0;
  return {
    value: parseFloat(normalized),
    prefix: prefix ?? '',
    suffix: suffix ?? '',
    decimals,
  };
}

/** Format an animated number to the precision used by its source string. */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function currentYear(): number {
  return new Date().getFullYear();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
