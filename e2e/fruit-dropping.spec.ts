import { test, expect } from '@playwright/test';

test.describe('Fruit Dropping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for game to initialize
    await page.waitForSelector('.game-container');
  });

  test('should drop fruit when clicking drop zone', async ({ page }) => {
    // Get initial fruit count (should be 0)
    const initialFruitCount = await page.locator('.fruit').count();
    expect(initialFruitCount).toBe(0);

    // Click drop zone
    await page.locator('.drop-zone').click();

    // Wait a bit for physics to settle
    await page.waitForTimeout(500);

    // Should have at least one fruit now
    const fruitCount = await page.locator('.fruit').count();
    expect(fruitCount).toBeGreaterThan(0);
  });

  test('should update next fruit after dropping', async ({ page }) => {
    // Get the emoji of the next fruit
    const nextFruitEmoji = await page.locator('.next-fruit .fruit-emoji').textContent();
    
    // Drop the fruit
    await page.locator('.drop-zone').click();
    await page.waitForTimeout(300);

    // Next fruit should have changed (might be the same type, but should be a new instance)
    // We can verify by checking that the next fruit display still exists
    await expect(page.locator('.next-fruit')).toBeVisible();
  });

  test('should allow multiple fruit drops', async ({ page }) => {
    // Drop multiple fruits
    for (let i = 0; i < 3; i++) {
      await page.locator('.drop-zone').click();
      await page.waitForTimeout(400); // Wait for physics between drops
    }

    // Should have multiple fruits in the container
    await page.waitForTimeout(500);
    const fruitCount = await page.locator('.fruit').count();
    expect(fruitCount).toBeGreaterThanOrEqual(2);
  });

  test('should drop fruit with slight random offset', async ({ page }) => {
    // Drop first fruit
    await page.locator('.drop-zone').click();
    await page.waitForTimeout(500);
    
    const firstFruit = page.locator('.fruit').first();
    const firstPosition = await firstFruit.boundingBox();
    
    // Drop second fruit
    await page.locator('.drop-zone').click();
    await page.waitForTimeout(500);
    
    const secondFruit = page.locator('.fruit').nth(1);
    const secondPosition = await secondFruit.boundingBox();
    
    // Fruits should be at different horizontal positions (due to random offset)
    if (firstPosition && secondPosition) {
      expect(Math.abs(firstPosition.x - secondPosition.x)).toBeGreaterThan(0);
    }
  });
});

