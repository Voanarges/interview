import { test, expect } from '@playwright/test';

test.describe('EventHub E2E', () => {
  test('homepage loads and shows EventHub branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h3')).toContainText('EventHub');
    await expect(page.getByRole('link', { name: 'Browse Events' })).toBeVisible();
  });

  test('events page shows list of events', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('h4')).toContainText('Events');
    await expect(page.getByText('Tech Conference 2026')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('JavaScript Meetup')).toBeVisible();
  });

  test('event detail page shows event info and registration form', async ({ page }) => {
    await page.goto('/events/1');
    await page.waitForResponse((r) => r.url().includes('/api/events/1') && r.status() === 200);
    await expect(page.getByText('About this event')).toBeVisible();
    await expect(page.getByText('Register for this event')).toBeVisible();
  });

  test('registration form works for open events', async ({ page }) => {
    await page.goto('/events/1');
    await page.waitForResponse((r) => r.url().includes('/api/events/1') && r.status() === 200);

    await page.getByLabel('Your Name').fill('Test User');
    await page.getByLabel('Email').fill(`test-${Date.now()}@example.com`);
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('registered successfully')).toBeVisible({ timeout: 5000 });
  });

  test('login page works', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome to EventHub')).toBeVisible();

    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForURL('**/events', { timeout: 5000 });
    await expect(page.getByText('Manage')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
  });

  test('admin can access manage events page', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/events', { timeout: 5000 });

    await page.getByText('Manage').click();
    await expect(page.getByText('Manage Events')).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Event' })).toBeVisible();
    await expect(page.getByText('Tech Conference 2026')).toBeVisible();
  });

  test('admin can access analytics page', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/events', { timeout: 5000 });

    await page.getByRole('link', { name: 'Analytics' }).click();
    await expect(page.getByText('Total Events')).toBeVisible();
    await expect(page.getByText('Total Registrations')).toBeVisible();
    await expect(page.getByText('Avg Occupancy')).toBeVisible();
  });

  test('planned event shows registration not open message', async ({ page }) => {
    await page.goto('/events/3');
    await page.waitForResponse((r) => r.url().includes('/api/events/3') && r.status() === 200);
    await expect(page.getByText('Registration is not open')).toBeVisible();
  });
});
