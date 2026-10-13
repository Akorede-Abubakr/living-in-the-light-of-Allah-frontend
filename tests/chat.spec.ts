import { test, expect, Page, APIRequestContext } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
});

async function signIn(page: Page, request: APIRequestContext) {
  const { token } = await (await request.get('http://127.0.0.1:5101/test-token')).json();
  await page.addInitScript(value => localStorage.setItem('brightmind_token', value), token);
  await page.goto('/chat');
  await expect(page.getByRole('heading', { name: 'LightBridge AI', exact: true })).toBeVisible();
}

test('chat requires sign-in', async ({ page }) => {
  await page.goto('/chat');
  await expect(page).toHaveURL(/\/login\?redirect=%2Fchat/);
});

test('React → authenticated Express → FastAPI chat with all languages and history (test inference only)', async ({ page, request }) => {
  await signIn(page, request);
  let count = 1;
  for (const language of ['en', 'yo', 'ha', 'ig']) {
    await page.getByLabel('Reply language').selectOption(language);
    await page.getByLabel('Your message').fill(`Hello ${language}`);
    const response = page.waitForResponse('**/api/ai/chat');
    await page.getByRole('button', { name: 'Send message' }).click();
    expect((await response).status()).toBe(200);
    await expect(page.getByText(`TEST ONLY [${language}] ${count} messages: Hello ${language}`, { exact: true })).toBeVisible();
    count += 2;
  }
  await page.getByRole('button', { name: 'New chat', exact: true }).click();
  await expect(page.getByRole('log')).not.toContainText('TEST ONLY');
  await expect(page.getByRole('heading', { name: 'Where shall we begin?' })).toBeVisible();
});

test('errors keep drafts, retry does not duplicate history, and text is rendered safely', async ({ page, request }) => {
  await signIn(page, request);
  await page.route('**/api/ai/chat', route => route.fulfill({ status: 504, json: { message: 'The response took too long. Please retry.' } }));
  const content = '<script>alert("hello")</script>';
  await page.getByLabel('Your message').fill(content);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('alert')).toContainText('too long');
  await expect(page.getByLabel('Your message')).toHaveValue(content);
  await page.unroute('**/api/ai/chat');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('log')).toContainText(`TEST ONLY [en] 1 messages: ${content}`);
  await expect(page.getByRole('log').locator('script')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('log')).not.toContainText('TEST ONLY');
});

test('loading, cancellation and session expiry', async ({ page, request }) => {
  await signIn(page, request);
  await page.route('**/api/ai/chat', async route => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await route.fulfill({ json: { success: true, data: { reply: 'Late result', model: 'NCAIR1/N-ATLaS', language: 'en' } } }).catch(() => {});
  });
  await page.getByLabel('Your message').fill('Keep my draft');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('thinking');
  await expect(page.getByLabel('Reply language')).toBeDisabled();
  await page.getByRole('button', { name: 'Stop waiting' }).click();
  await expect(page.getByLabel('Your message')).toHaveValue('Keep my draft');
  await page.waitForTimeout(900);
  await expect(page.getByRole('log')).not.toContainText('Late result');
  await page.unroute('**/api/ai/chat');
  await page.evaluate(() => localStorage.setItem('brightmind_token', 'expired'));
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('link', { name: 'Sign in again' })).toBeVisible();
});

test('mobile layout fits and long history is bounded in complete turns', async ({ page, request }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await signIn(page, request);
  for (let i = 0; i < 12; i++) {
    await page.getByLabel('Your message').fill(`Message ${i}`);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('log')).toContainText(`TEST ONLY [en] ${Math.min(i * 2 + 1, 21)} messages: Message ${i}`);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/chat-mobile.png', fullPage: true });
});
