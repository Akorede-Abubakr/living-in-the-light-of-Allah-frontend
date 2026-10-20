import { test, expect, Page, APIRequestContext } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // External typography is irrelevant to functionality and must not stall load.
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
});

async function signIn(page: Page, request: APIRequestContext) {
  const { token } = await (await request.get('http://127.0.0.1:5101/test-token')).json();
  await page.addInitScript(value => localStorage.setItem('brightmind_token', value), token);
  await page.addInitScript(() => {
    (window as any).microphoneStreams = [];
    (window as any).revokedUrls = [];
    const getMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async constraints => {
      const stream = await getMedia(constraints);
      (window as any).microphoneStreams.push(stream);
      return stream;
    };
    const revoke = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = url => { (window as any).revokedUrls.push(url); revoke(url); };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (text: string) => { (window as any).copiedTranscript = text; },
    } });
  });
  await page.goto('/transcribe', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Speech to Text', exact: true })).toHaveAttribute('aria-current', 'page');
}

function wav() {
  const audio = Buffer.alloc(44 + 3200 * 2);
  audio.write('RIFF', 0); audio.writeUInt32LE(audio.length - 8, 4); audio.write('WAVEfmt ', 8);
  audio.writeUInt32LE(16, 16); audio.writeUInt16LE(1, 20); audio.writeUInt16LE(1, 22);
  audio.writeUInt32LE(16000, 24); audio.writeUInt32LE(32000, 28); audio.writeUInt16LE(2, 32); audio.writeUInt16LE(16, 34);
  audio.write('data', 36); audio.writeUInt32LE(audio.length - 44, 40);
  for (let i = 0; i < 3200; i++) audio.writeInt16LE(Math.round(1000 * Math.sin(2 * Math.PI * 440 * i / 16000)), 44 + i * 2);
  return audio;
}

async function chooseAudio(page: Page) {
  await page.getByLabel('Choose audio file', { exact: true }).setInputFiles({ name: 'speech.wav', mimeType: 'audio/wav', buffer: wav() });
  await expect(page.getByLabel('Recording preview')).toBeVisible();
}

test('protects the route and keeps a visible navigation link', async ({ page }) => {
  await page.goto('/transcribe', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/login\?redirect=%2Fchat%3Fmode%3Dtranscribe/);
  await expect(page.getByRole('link', { name: 'LightBridge AI', exact: true })).toBeVisible();
});

test('browser recording → Express → existing FastAPI factory → transcript and copy', async ({ page, request }) => {
  await signIn(page, request);
  await page.getByRole('button', { name: 'Start recording', exact: true }).click();
  await expect(page.getByText('Recording in progress', { exact: true })).toBeVisible();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await expect(page.getByLabel('Recording preview')).toBeVisible();
  expect(await page.evaluate(() => (window as any).microphoneStreams.every((s: MediaStream) => s.getTracks().every(t => t.readyState === 'ended')))).toBe(true);
  const response = page.waitForResponse('**/api/ai/transcribe');
  await page.getByRole('button', { name: 'Transcribe audio', exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(page.getByLabel('Transcript', { exact: true })).toHaveValue('Ẹ káàárọ̀');
  await page.getByRole('button', { name: 'Copy transcript', exact: true }).click();
  expect(await page.evaluate(() => (window as any).copiedTranscript)).toBe('Ẹ káàárọ̀');
  const oldUrl = await page.getByLabel('Recording preview').getAttribute('src');
  await page.getByRole('button', { name: 'Record again', exact: true }).click();
  await expect(page.getByText('Recording in progress', { exact: true })).toBeVisible();
  expect(await page.evaluate(url => (window as any).revokedUrls.includes(url), oldUrl)).toBe(true);
  await page.getByRole('link', { name: 'About', exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  expect(await page.evaluate(() => (window as any).microphoneStreams.every((s: MediaStream) => s.getTracks().every(t => t.readyState === 'ended')))).toBe(true);
});

test('selects Nigerian English, uploads WAV and handles direct refresh', async ({ page, request }) => {
  await signIn(page, request);
  await page.reload();
  await page.getByLabel('Recording language', { exact: true }).selectOption('en-NG');
  await chooseAudio(page);
  await page.getByRole('button', { name: 'Transcribe audio', exact: true }).click();
  await expect(page.getByLabel('Transcript', { exact: true })).toHaveValue('Good morning from Nigeria.');
  await expect(page.getByText('Nigerian English · Transcription complete')).toBeVisible();
});

test('automatically stops at the configured limit', async ({ page, request }) => {
  await signIn(page, request);
  await page.getByRole('button', { name: 'Start recording', exact: true }).click();
  await expect(page.getByLabel('Recording preview')).toBeVisible();
  await expect(page.getByLabel('Recording duration')).toHaveText('00:02');
  expect(await page.evaluate(() => (window as any).microphoneStreams.every((s: MediaStream) => s.getTracks().every(t => t.readyState === 'ended')))).toBe(true);
});

test('explains denied microphone permission', async ({ page, request }) => {
  await signIn(page, request);
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('denied', 'NotAllowedError'); }; });
  await page.getByRole('button', { name: 'Start recording', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Microphone permission was denied');
  await expect(page.getByRole('button', { name: 'Start recording', exact: true })).toBeEnabled();
});

test('offers file upload when no compatible recorder MIME type exists', async ({ page, request }) => {
  await signIn(page, request);
  await page.evaluate(() => { MediaRecorder.isTypeSupported = () => false; });
  await page.getByRole('button', { name: 'Start recording', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('cannot record a supported audio format');
  expect(await page.evaluate(() => (window as any).microphoneStreams.length)).toBe(0);
  await chooseAudio(page);
  await page.getByRole('button', { name: 'Transcribe audio', exact: true }).click();
  await expect(page.getByLabel('Transcript', { exact: true })).toHaveValue('Ẹ káàárọ̀');
});

test('closes late microphone permission streams after cancellation', async ({ page, request }) => {
  await signIn(page, request);
  await page.evaluate(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async constraints => {
      const stream = await original(constraints);
      return new Promise(resolve => { (window as any).releaseMicrophone = () => resolve(stream); });
    };
  });
  await page.getByRole('button', { name: 'Start recording', exact: true }).click();
  await page.waitForFunction(() => typeof (window as any).releaseMicrophone === 'function');
  await page.getByRole('button', { name: 'Cancel microphone request' }).click();
  await page.evaluate(() => (window as any).releaseMicrophone());
  await expect.poll(() => page.evaluate(() => (window as any).microphoneStreams.every((s: MediaStream) => s.getTracks().every(t => t.readyState === 'ended')))).toBe(true);
  await expect(page.getByRole('button', { name: 'Start recording', exact: true })).toBeEnabled();
});

test('keeps the recording for retry after API failure and shows processing state', async ({ page, request }) => {
  await signIn(page, request);
  await chooseAudio(page);
  const url = await page.getByLabel('Recording preview').getAttribute('src');
  let attempts = 0;
  await page.route('**/api/ai/transcribe', async route => {
    if (++attempts === 1) {
      await new Promise(resolve => setTimeout(resolve, 400));
      await route.fulfill({ status: 503, json: { success: false, message: 'Speech to Text is temporarily unavailable. Please retry.' } });
    } else await route.continue();
  });
  await page.getByRole('button', { name: 'Transcribe audio', exact: true }).click();
  await expect(page.getByText('Transcribing your audio…', { exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('temporarily unavailable');
  await expect(page.getByLabel('Recording preview')).toHaveAttribute('src', url!);
  await page.getByRole('button', { name: 'Retry transcription', exact: true }).click();
  await expect(page.getByLabel('Transcript', { exact: true })).toHaveValue('Ẹ káàárọ̀');
});

test('handles expired authentication, invalid files and mobile layout', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page, request);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByLabel('Choose audio file', { exact: true }).setInputFiles({ name: 'speech.mp3', mimeType: 'audio/mpeg', buffer: Buffer.from('bad') });
  await expect(page.getByRole('alert')).toContainText('Choose a WAV, WebM or OGG');
  await chooseAudio(page);
  await page.route('**/api/ai/transcribe', route => route.fulfill({ status: 401, json: { message: 'Expired' } }));
  await page.getByRole('button', { name: 'Transcribe audio', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Your session has expired');
  await expect(page.getByRole('link', { name: 'Sign in again', exact: true })).toHaveAttribute('href', '/login?redirect=%2Fchat%3Fmode%3Dtranscribe');
});
