// @ts-check
import { test, expect } from '@playwright/test';

test('basic homepage test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Volt/);
});
