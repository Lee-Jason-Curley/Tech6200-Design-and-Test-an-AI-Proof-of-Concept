import { test, expect } from '@playwright/test';

test.describe('AB#100004 Weather service URL misconfigured', () => {
  test('TC4 / Steps 1-3: wrong weather service URL for "Salt Lake City, Utah" shows no weather card and the app stays up', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    // Step 1: point the weather service at an invalid address (the real URL and API key are not changed or logged)
    let reroutedRequests = 0;
    await page.route('https://api.openweathermap.org/**', async (route) => {
      reroutedRequests++;
      await route.continue({ url: 'https://invalid.invalid/data/2.5/weather' });
    });

    // Step 2: open the app and type "Salt Lake City, Utah" in the city box
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter city').fill('Salt Lake City, Utah');

    // Step 3: click Search
    await page.getByRole('button', { name: 'Search' }).click();

    // The request was actually sent to the invalid address
    await expect.poll(() => reroutedRequests).toBe(1);

    // Expected: no weather card is shown
    await expect(page.getByText(/Temperature:/)).toHaveCount(0);
    await expect(page.getByText(/Weather:/)).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Salt Lake City/ })).toHaveCount(0);

    // Expected: the app does not crash or go blank (the message text is not specified, so it is not asserted)
    await expect(page.getByPlaceholder('Enter city')).toBeVisible();
    await expect(page.getByPlaceholder('Enter city')).toHaveValue('Salt Lake City, Utah');
    await expect(page.getByRole('button', { name: 'Search' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();
    await expect(page.getByText(/Meteorological predictions/)).toBeVisible();
    expect(pageErrors, 'no uncaught page errors').toHaveLength(0);
  });
});
