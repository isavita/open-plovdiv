import { describe, expect, it } from "vitest";
import { buildReport, formatReportId, validateReportUpdate, validateSubmission } from "./moderation";

const valid = {
  category: "pavement",
  title: "Uneven pavement near a stop",
  description: "The pedestrian paving is damaged next to a public stop.",
  lat: 42.1421,
  lng: 24.7483,
  lang: "en",
  no_personal_data: true,
  public_interest: true
};

describe("validateSubmission", () => {
  it("accepts a clean submission", () => {
    const result = validateSubmission(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.category).toBe("pavement");
      expect(result.value.lang).toBe("en");
    }
  });

  it("rejects an unknown category", () => {
    const result = validateSubmission({ ...valid, category: "spaceport" });
    expect(result).toEqual({ ok: false, error: "invalid_category" });
  });

  it("rejects a too-short title", () => {
    expect(validateSubmission({ ...valid, title: "ab" })).toEqual({
      ok: false,
      error: "invalid_title"
    });
  });

  it("rejects text that looks like personal data", () => {
    const result = validateSubmission({
      ...valid,
      description: "Please call me at me@example.com about this issue."
    });
    expect(result).toEqual({ ok: false, error: "contains_personal_data" });
  });

  it("rejects a location outside Plovdiv", () => {
    expect(validateSubmission({ ...valid, lat: 48.85, lng: 2.35 })).toEqual({
      ok: false,
      error: "invalid_location"
    });
  });

  it("requires both confirmations", () => {
    expect(validateSubmission({ ...valid, public_interest: false })).toEqual({
      ok: false,
      error: "missing_confirmation"
    });
  });
});

describe("report building", () => {
  it("formats ids with a zero-padded sequence", () => {
    expect(formatReportId(2026, 1)).toBe("fix-plovdiv-2026-000001");
    expect(formatReportId(2026, 42)).toBe("fix-plovdiv-2026-000042");
  });

  it("creates a pending report from a clean submission", () => {
    const result = validateSubmission(valid);
    if (!result.ok) throw new Error("expected valid submission");
    const report = buildReport(result.value, "fix-plovdiv-2026-000001");
    expect(report.moderation_status).toBe("needs_review");
    expect(report.public_status).toBe("unverified");
    expect(report.source).toBe("citizen_submission");
    expect(report.title_en).toBe(valid.title); // mirrored for EN submissions
    expect(report.audit[0].action).toBe("submitted");
  });
});

describe("validateReportUpdate", () => {
  const update = {
    category: "roads",
    title_bg: "Дупка на пътя",
    title_en: "Pothole in the road",
    description_bg: "Има дупка в платното до обществена спирка.",
    description_en: "There is a pothole in the road near a public stop.",
    lat: 42.1421,
    lng: 24.7483,
    address_bg: "Централен район",
    address_en: "Tsentralen district"
  };

  it("accepts edited public report details", () => {
    const result = validateReportUpdate(update);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.category).toBe("roads");
      expect(result.value.location.address_bg).toBe("Централен район");
    }
  });

  it("rejects edited details outside Plovdiv", () => {
    expect(validateReportUpdate({ ...update, lat: 41.9 })).toEqual({
      ok: false,
      error: "invalid_location"
    });
  });

  it("rejects edited details with personal data", () => {
    expect(validateReportUpdate({ ...update, description_bg: "Пишете на person@example.com за детайли." })).toEqual({
      ok: false,
      error: "contains_personal_data"
    });
  });
});
