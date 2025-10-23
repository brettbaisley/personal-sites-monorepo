// scripts/daily-monitor.js
import { test, expect } from '@playwright/test';

test('Page Has Title', async ({ page }) => {
    await page.goto('https://brettbaisley.com');
    await expect(page).toHaveTitle('Brett Baisley');
    console.log('✅ Page has correct title.');
});


test('Contact form submission works correctly', async ({ page }) => {
    await page.goto('https://brettbaisley.com');

    // Wait for the contact form to be visible, then fill in
    await page.getByLabel('name').fill('GitHub Actions Daily Synthetic Check');
    await page.getByLabel('email').fill('brett.baisley@gmail.com');
    await page.getByLabel('message').fill('This is a synthetic check run by a GitHub Action to test to ensure the email functionality is still working.');

    // Wait for the submit button to be visible and click it
    const submitButton = await page.getByRole('button', { name: 'Send Message' })
    await submitButton.click();

    // Wait for the success message to appear
    await expect(page.getByText('Your message has sent successfully.')).toBeVisible({ timeout: 30000 });
    console.log('✅ Form submitted successfully.');
});