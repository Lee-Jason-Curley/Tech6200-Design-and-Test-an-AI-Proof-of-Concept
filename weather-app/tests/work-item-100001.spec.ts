import { test, expect } from '@playwright/test';

test.describe('AB#100001 Search by "City, State"', () => {
  test('TC1 / Steps 1-3: valid "City, State" input shows a weather card and no error', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Step 1: type "Salt Lake City, Utah" in the city box
    await page.getByPlaceholder('Enter city').fill('Salt Lake City, Utah');

    // Step 2: click Search
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 3: weather card is shown for Salt Lake City
    await expect(page.getByRole('heading', { name: 'Salt Lake City' })).toBeVisible();
    await expect(page.getByText(/Temperature:/)).toBeVisible();
    await expect(page.getByText(/Weather:/)).toBeVisible();

    // Step 3: no red error message appears
    await expect(page.getByText('Invalid city. Please check the name and try again.')).toHaveCount(0);
  });
});
