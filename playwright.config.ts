import { defineConfig } from '@playwright/test';
import path from 'node:path';

const python = process.env.AI_TEST_PYTHON || path.resolve('../ai-service/.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');

export default defineConfig({
  testDir: './tests', testMatch: '*.spec.ts', fullyParallel: false, workers: 1,
  timeout: 60000, expect: { timeout: 15000 }, reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5193',
    channel: process.env.PLAYWRIGHT_CHANNEL,
    launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] },
    trace: 'retain-on-failure',
  },
  webServer: [
    { command: `"${python}" tests/fixtures/mock_asr.py`, url: 'http://127.0.0.1:8101/health', reuseExistingServer: false, timeout: 60000 },
    { command: 'node tests/fixtures/backend.cjs', url: 'http://127.0.0.1:5101/api/health', reuseExistingServer: false },
    { command: 'npm run dev -- --host 127.0.0.1 --port 5193 --strictPort', url: 'http://127.0.0.1:5193', reuseExistingServer: false,
      env: { DEV_API_PROXY_TARGET: 'http://127.0.0.1:5101', VITE_API_BASE_URL: '/api', VITE_SPEECH_MAX_SECONDS: '2' } },
  ],
});
