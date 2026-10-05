import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./Checkout";

const validCheckoutData = {
  full_name: "Abhinandan",
  phone: "9876543210",
  address_line: "12 Main Road",
  city: "Guntur",
  state: "Andhra Pradesh",
  pincode: "522001",
};

describe("Checkout Zod Validation", () => {
  it("accepts valid checkout data", () => {
    const result = checkoutSchema.safeParse(validCheckoutData);

    expect(result.success).toBe(true);
  });

  it("rejects a missing full name", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutData,
      full_name: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid Indian phone number", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutData,
      phone: "1234567890",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a phone number with incorrect length", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutData,
      phone: "987654321",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an address shorter than five characters", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutData,
      address_line: "Road",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing city and state", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutData,
      city: "",
      state: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid six-digit PIN code", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckoutData,
      pincode: "52200",
    });

    expect(result.success).toBe(false);
  });
});
