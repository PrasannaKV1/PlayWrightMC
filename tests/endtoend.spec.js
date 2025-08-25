const { test, expect } = require('@playwright/test');

test.describe('Volt Money - Loan Eligibility Page (Positive Flows)', () => {
  const URL = 'https://voltmoney.in/check-loan-eligibility-against-mutual-funds';

  test('TC_FUNC_01 – Page loads successfully with all elements', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Title check
    console.log('Page Title:', await page.title());
    await expect(page).toHaveTitle(/Volt Money/i);

    // Check presence of form container
    await expect(page.locator('form')).toBeVisible();

    // Input fields
    await expect(page.locator('input[placeholder="Enter mobile number"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter PAN"]')).toBeVisible();

    // Button check
    await expect(page.getByRole('button', { name: /Check eligibility for FREE/i })).toBeVisible();
  });

  test('TC_FUNC_02 – Mobile number field accepts valid input', async ({ page }) => {
    await page.goto(URL);
    const mobile = page.locator('input[placeholder="Enter mobile number"]');
    await mobile.fill('9876543210');
    await expect(mobile).toHaveValue('9876543210');
  });

  test('TC_FUNC_03 – PAN field accepts valid input', async ({ page }) => {
    await page.goto(URL);
    const pan = page.locator('input[placeholder="Enter PAN"]');
    await pan.fill('ABCDE1234F');
    await expect(pan).toHaveValue('ABCDE1234F');
  });

  test('TC_FUNC_04 – Valid details allow submission (OTP step)', async ({ page }) => {
    await page.goto(URL);

    await page.fill('input[placeholder="Enter mobile number"]', '9876543210');
    await page.fill('input[placeholder="Enter PAN"]', 'ABCDE1234F');
    await page.getByRole('button', { name: /Check eligibility for FREE/i }).click();

    // Wait for transition
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Screenshot for debug
    await page.screenshot({ path: 'debug_after_submit.png', fullPage: true });

    const otpField = page.locator('input[placeholder*="OTP"]');
    const isVisible = await otpField.isVisible();
    console.log('OTP Field Visible:', isVisible);

    await expect(otpField).toBeVisible({ timeout: 10000 });
  });
});
