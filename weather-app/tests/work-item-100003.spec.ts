import { test, expect } from '@playwright/test';

test.describe('AB#100003 Page turns green on successful search', () => {
  test('TC1 / Steps 1-3: valid "Riverton, Utah" shows a green weather card and no red error', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Step 1: type "Riverton, Utah" in the city box
    await page.getByPlaceholder('Enter city').fill('Riverton, Utah');

    // Step 2: click Search
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 3: weather card is shown for Riverton
    const card = page.locator('div', { has: page.getByRole('heading', { name: 'Riverton' }) }).last();
    await expect(page.getByRole('heading', { name: 'Riverton' })).toBeVisible();
    await expect(page.getByText(/Temperature:/)).toBeVisible();

    // Step 3: the card is green (green channel dominates red and blue)
    const background = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    const [r, g, b] = background.match(/\d+/g)!.map(Number);
    expect(g, `card background ${background} should be green`).toBeGreaterThan(Math.max(r, b));

    // Step 3: no red error message appears
    await expect(page.getByText('Invalid city. Please check the name and try again.')).toHaveCount(0);
  });
});
