/**
 * CI: static SEO tax-rate / deduction / credit claims must match the engine
 * (or be explicitly listed as manual-review-only).
 *
 * Run via: npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ASSERTABLE_CLAIMS,
  MANUAL_REVIEW_CLAIMS,
  assertClaimsMatchEngine,
  assertProseContainsClaimMatches,
  runContentDriftAudit,
} from "./content-drift-audit";

describe("SEO content drift audit (static rate/$ vs engine)", () => {
  it("every assertable claim matches STATE_TAX / engine constants", () => {
    const failures = assertClaimsMatchEngine();
    assert.deepEqual(failures, [], failures.join("\n"));
  });

  it("every assertable claim’s proseMatch still appears in SEO blobs", () => {
    const failures = assertProseContainsClaimMatches();
    assert.deepEqual(failures, [], failures.join("\n"));
  });

  it("no tax-like %/$ figure is left uncovered (asserted or manual-review)", () => {
    const report = runContentDriftAudit();
    assert.deepEqual(
      report.uncovered,
      [],
      report.uncovered
        .map((f) => `${f.blobId} → ${f.raw}`)
        .join("\n")
    );
  });

  it("manual-review list entries are observed (no stale placeholders)", () => {
    const report = runContentDriftAudit();
    assert.deepEqual(
      report.staleManualClaimIds,
      [],
      `Stale manual-review ids: ${report.staleManualClaimIds.join(", ")}`
    );
  });

  it("prints coverage summary", () => {
    const report = runContentDriftAudit();
    // Tax-like = found − ignored (example salaries / live nets)
    const taxLike = report.figuresFound - report.ignored;
    console.log(
      [
        "",
        "—— SEO content drift coverage ——",
        `Static prose blobs scanned:     ${report.blobCount}`,
        `Figures extracted (% / $):      ${report.figuresFound}`,
        `  ignored (examples/live nets): ${report.ignored}`,
        `Tax-like static claims found:   ${taxLike}`,
        `  covered by automated check:   ${report.asserted}`,
        `  manual-review-only:           ${report.manualReview}`,
        `  uncovered (must be 0):        ${report.uncovered.length}`,
        `Assertable claim definitions:   ${ASSERTABLE_CLAIMS.length}`,
        `Manual-review definitions:      ${MANUAL_REVIEW_CLAIMS.length}`,
        `Asserted claim ids hit:         ${report.assertedClaimIds.join(", ")}`,
        `Manual claim ids hit:           ${report.manualClaimIds.join(", ")}`,
        "——————————————",
      ].join("\n")
    );
    assert.equal(report.uncovered.length, 0);
    assert.ok(taxLike > 0);
    assert.equal(report.asserted + report.manualReview, taxLike);
  });
});
