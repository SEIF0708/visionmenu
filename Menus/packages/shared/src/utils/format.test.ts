import { describe, it, expect } from "vitest";
import { formatPrice, slugify } from "./format";

describe("formatPrice", () => {
  it("formats USD prices correctly", () => {
    expect(formatPrice(16.99)).toBe("$16.99");
  });

  it("formats whole numbers", () => {
    expect(formatPrice(10)).toBe("$10.00");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Margherita Pizza")).toBe("margherita-pizza");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(slugify("test   slug")).toBe("test-slug");
  });
});
