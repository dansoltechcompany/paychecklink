import type { FilingStatus } from "../types";

/**
 * California Form 540 exemption tax credits (2025 FTB indexed amounts).
 * These are dollar-for-dollar credits against computed CA tax — not deductions.
 * Source: FTB Form 540 / Tax News October 2025 indexing.
 */
export const CA_EXEMPTION_CREDITS_2025 = {
  /** Single, married filing separately, or head of household */
  personalSingleOrHead: 153,
  /** Married filing jointly / qualifying surviving spouse (2 × personal) */
  personalMarried: 306,
  /** Per dependent */
  dependent: 475,
  /**
   * Federal AGI above which exemption credits begin to phase out (single /
   * separate / HOH approximation). Full FTB worksheet not modeled.
   */
  phaseOutStartApprox: 252203,
} as const;

export function getCaPersonalExemptionCredit(
  filingStatus: FilingStatus
): number {
  return filingStatus === "married"
    ? CA_EXEMPTION_CREDITS_2025.personalMarried
    : CA_EXEMPTION_CREDITS_2025.personalSingleOrHead;
}

export function getCaExemptionCredits(
  filingStatus: FilingStatus,
  dependents = 0,
  annualGross = 0
): number {
  // High-AGI phase-out: skip credits once past the published start threshold.
  // (Exact FTB reduction worksheet is not modeled.)
  if (annualGross >= CA_EXEMPTION_CREDITS_2025.phaseOutStartApprox) {
    return 0;
  }

  const personal = getCaPersonalExemptionCredit(filingStatus);
  const deps = Math.max(0, Math.floor(dependents)) * CA_EXEMPTION_CREDITS_2025.dependent;
  return personal + deps;
}

/** Apply CA exemption credits to computed Schedule X/Y/Z tax. */
export function applyCaExemptionCredits(
  taxBeforeCredits: number,
  filingStatus: FilingStatus,
  options?: { dependents?: number; annualGross?: number }
): number {
  const credits = getCaExemptionCredits(
    filingStatus,
    options?.dependents ?? 0,
    options?.annualGross ?? 0
  );
  return Math.max(0, taxBeforeCredits - credits);
}
