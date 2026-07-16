import { describe, expect, it } from "vitest";
import { validateRentalRequest } from "./rental-validation";

const minimumDate = "2026-07-18";
const validRequest = {
  name: "Eko Andri",
  contact: "eko@example.com",
  date: "2026-07-18",
  duration: "3 months",
  minimumDate,
  hasInvalidDateInput: false,
};

describe("validateRentalRequest", () => {
  it("accepts valid email and WhatsApp contacts", () => {
    expect(validateRentalRequest(validRequest)).toEqual({});
    expect(validateRentalRequest({ ...validRequest, contact: "+62 812-3456-7890" })).toEqual({});
  });

  it("rejects malformed emails", () => {
    expect(validateRentalRequest({ ...validRequest, contact: "eko.test@test" }).contact).toBe(
      "Enter a valid email address or WhatsApp number.",
    );
  });

  it("requires a duration", () => {
    expect(validateRentalRequest({ ...validRequest, duration: "" }).duration).toBe(
      "Choose a rental duration.",
    );
  });

  it("rejects incomplete and too-early dates", () => {
    expect(validateRentalRequest({ ...validRequest, hasInvalidDateInput: true }).date).toBe(
      "Enter a complete, valid calendar date.",
    );
    expect(validateRentalRequest({ ...validRequest, date: "2026-07-17" }).date).toContain(
      minimumDate,
    );
  });
});
