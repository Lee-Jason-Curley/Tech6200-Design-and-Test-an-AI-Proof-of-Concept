import { test, expect } from '@playwright/test';

test.describe('AB#100002 Invalid search value shows an error message', () => {
  test('TC2 / Steps 1-2: invalid city "Zzzxqwv" shows the red invalid-city error and no weather card', async ({ page }) => {
    const errorMessage = page.getByText('Invalid city. Please check the name and try again.');

    await page.goto('http://localhost:3000');

    // Step 1: type "Zzzxqwv" in the city box
    await page.getByPlaceholder('Enter city').fill('Zzzxqwv');

    // Input rule: the error appears only after the user clicks Search
    await expect(errorMessage).toHaveCount(0);

    // Step 2: click Search
    await page.getByRole('button', { name: 'Search' }).click();

    // Expected: the message is displayed in red
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)');

    // Expected: no weather card is shown
    await expect(page.getByText(/Temperature:/)).toHaveCount(0);
    await expect(page.getByText(/Weather:/)).toHaveCount(0);
  });
});
