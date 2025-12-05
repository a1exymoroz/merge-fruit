import { test, expect } from '@playwright/test';

test.describe('Game Over', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.game-container');
  });

  test('should trigger game over when fruits stack above line', async ({ page }) => {
    // Initially, game over overlay should not be visible
    await expect(page.locator('.game-over-overlay')).not.toBeVisible();

    // Drop many fruits rapidly to fill the container
    // This should eventually trigger game over
    for (let i = 0; i < 30; i++) {
      await page.locator('.drop-zone').click();
      await page.waitForTimeout(200); // Small delay between drops
      
      // Check if game over appeared
      const gameOverVisible = await page.locator('.game-over-overlay').isVisible();
      if (gameOverVisible) {
        break;
      }
    }

    // Wait for game over condition (2 seconds after fruit crosses line)
    await page.waitForTimeout(2500);

    // Game over overlay should be visible
    await expect(page.locator('.game-over-overlay')).toBeVisible();
    await expect(page.locator('.game-over h2')).toContainText('Game Over!');
  });

  test('should display final score on game over', async ({ page }) => {
    // Fill container to trigger game over
    for (let i = 0; i < 30; i++) {
      await page.locator('.drop-zone').click();
      await page.waitForTimeout(200);
      
      if (await page.locator('.game-over-overlay').isVisible()) {
        break;
      }
    }

    await page.waitForTimeout(2500);

    // Should show final score
    await expect(page.locator('.game-over p')).toContainText('Final Score:');
  });

  test('should show play again button on game over', async ({ page }) => {
    // Trigger game over
    for (let i = 0; i < 30; i++) {
      await page.locator('.drop-zone').click();
      await page.waitForTimeout(200);
      
      if (await page.locator('.game-over-overlay').isVisible()) {
        break;
      }
    }

    await page.waitForTimeout(2500);

    // Should have play again button
    await expect(page.locator('.game-over button')).toContainText('Play Again');
  });

  test('should reset game when clicking play again', async ({ page }) => {
    // Trigger game over
    for (let i = 0; i < 30; i++) {
      await page.locator('.drop-zone').click();
      await page.waitForTimeout(200);
      
      if (await page.locator('.game-over-overlay').isVisible()) {
        break;
      }
    }

    await page.waitForTimeout(2500);

    // Click play again
    await page.locator('.game-over button').click();

    // Game over overlay should disappear
    await expect(page.locator('.game-over-overlay')).not.toBeVisible();

    // Score should reset (or be preserved, depending on implementation)
    // At minimum, game should be playable again
    await expect(page.locator('.drop-zone')).toBeVisible();
  });

  test('should reset game when clicking reset button', async ({ page }) => {
    // Drop some fruits
    for (let i = 0; i < 5; i++) {
      await page.locator('.drop-zone').click();
      await page.waitForTimeout(300);
    }

    // Click reset button
    await page.locator('.reset-button').click();
    await page.waitForTimeout(500);

    // Score should be 0
    await expect(page.locator('.score')).toContainText('Score: 0');

    // Fruits should be cleared (or mostly cleared)
    // Game should be ready to play again
    await expect(page.locator('.drop-zone')).toBeVisible();
  });
});

