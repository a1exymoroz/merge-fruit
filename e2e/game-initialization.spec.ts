import { test, expect } from '@playwright/test';

test.describe('Game Initialization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Fruit Merge');
  });

  test('should display initial score of 0', async ({ page }) => {
    await expect(page.locator('.score')).toContainText('Score: 0');
  });

  test('should display high score', async ({ page }) => {
    await expect(page.locator('.high-score')).toContainText('High Score:');
  });

  test('should show next fruit display', async ({ page }) => {
    await expect(page.locator('.next-fruit-container')).toBeVisible();
    await expect(page.locator('.next-fruit-container p')).toContainText('Next Fruit:');
    await expect(page.locator('.next-fruit')).toBeVisible();
  });

  test('should display game container', async ({ page }) => {
    await expect(page.locator('.game-container-wrapper')).toBeVisible();
    await expect(page.locator('.game-container')).toBeVisible();
  });

  test('should display game over line', async ({ page }) => {
    await expect(page.locator('.game-over-line')).toBeVisible();
    await expect(page.locator('.game-over-line span')).toContainText('Game Over Line');
  });

  test('should display drop zone', async ({ page }) => {
    await expect(page.locator('.drop-zone')).toBeVisible();
    await expect(page.locator('.drop-indicator')).toContainText('Click to Drop');
  });

  test('should display reset button', async ({ page }) => {
    await expect(page.locator('.reset-button')).toBeVisible();
    await expect(page.locator('.reset-button')).toContainText('Reset Game');
  });

  test('should display instructions', async ({ page }) => {
    await expect(page.locator('.instructions')).toBeVisible();
    await expect(page.locator('.instructions h3')).toContainText('How to Play:');
  });

  test('should not show game over overlay initially', async ({ page }) => {
    await expect(page.locator('.game-over-overlay')).not.toBeVisible();
  });
});

