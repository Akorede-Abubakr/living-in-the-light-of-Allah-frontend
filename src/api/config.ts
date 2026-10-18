const productionApiOrigin = 'https://living-in-the-light-of-allah-backend.onrender.com';
export const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? `${productionApiOrigin}/api` : '/api')
).replace(/\/$/, '');
const productionMediaOrigin = productionApiOrigin;
const mediaOrigin = (
  import.meta.env.VITE_MEDIA_BASE_URL ||
  (apiBaseUrl.startsWith('https://') || apiBaseUrl.startsWith('http://')
    ? new URL(apiBaseUrl).origin
    : import.meta.env.PROD ? productionMediaOrigin : '')
).replace(/\/$/, '');

// Existing records store /uploads paths. Resolve them against the independently
// hosted backend without changing public /images assets or third-party URLs.
export function resolveUploadUrls(value: unknown): unknown {
  if (!mediaOrigin) return value;
  if (typeof value === 'string') return value.startsWith('/uploads/') ? `${mediaOrigin}${value}` : value;
  if (Array.isArray(value)) return value.map(resolveUploadUrls);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveUploadUrls(item)]));
  }
  return value;
}

// Keep existing relative storage keys when editable API data is sent back.
export function restoreUploadUrls(value: unknown): unknown {
  if (!mediaOrigin) return value;
  if (typeof value === 'string') return value.startsWith(`${mediaOrigin}/uploads/`) ? value.slice(mediaOrigin.length) : value;
  if (value instanceof FormData) {
    const form = new FormData();
    value.forEach((item, key) => form.append(key, typeof item === 'string' ? restoreUploadUrls(item) as string : item));
    return form;
  }
  if (Array.isArray(value)) return value.map(restoreUploadUrls);
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, restoreUploadUrls(item)]));
  }
  return value;
}
