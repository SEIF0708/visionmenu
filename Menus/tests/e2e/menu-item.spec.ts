import { test, expect } from "@playwright/test";

test.describe("Menu Item AR Experience", () => {
  test("should load menu item page", async ({ page }) => {
    await page.goto("/demo-pizzeria/menu/margherita-pizza");

    await expect(page.locator("h1")).toContainText("Margherita Pizza");
    await expect(page.locator("model-viewer")).toBeVisible({ timeout: 10000 });
  });

  test("should show error state for invalid item", async ({ page }) => {
    await page.goto("/demo-pizzeria/menu/non-existent-item");
    await expect(page.locator("text=not found")).toBeVisible();
  });

  test("should display pricing", async ({ page }) => {
    await page.goto("/demo-pizzeria/menu/margherita-pizza");
    await expect(page.locator("text=$16.99")).toBeVisible();
  });

  test("should have mobile-friendly layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/demo-pizzeria/menu/margherita-pizza");
    await expect(page.locator("h1")).toBeVisible();
  });
});
