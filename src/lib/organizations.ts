export const DEFAULT_ORGANIZATIONS = [
  "Canvas",
  "Mont Marte",
  "Deepto TV",
  "ICT Division",
  "Bisorgo Technology",
  "CCJ-B",
  "Radiant Pharma",
  "University of Dhaka",
] as const;

const LEGACY_PLACEHOLDERS = new Set(["Vogue", "Spotify", "Nike", "Netflix", "Sony"]);

/** Always preserves all verified default organizations and appends any extra non-placeholder names. */
export function mergeOrganizations(extra: unknown[]): string[] {
  const result: string[] = [...DEFAULT_ORGANIZATIONS];
  const seen = new Set(result.map((name) => name.toLowerCase()));
  for (const item of extra) {
    const clean = typeof item === "string" ? item.trim() : "";
    if (!clean || LEGACY_PLACEHOLDERS.has(clean) || seen.has(clean.toLowerCase())) continue;
    seen.add(clean.toLowerCase());
    result.push(clean);
  }
  return result;
}
