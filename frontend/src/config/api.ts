/**
 * Centralized API configuration.
 *
 * Goal:
 * - Always produce a base URL that ends with exactly one `/api`
 * - Avoid `/api/api/...` duplication
 * - Avoid Vercel same-origin `/api` 503s when backend origin is missing
 */

const DEFAULT_PROD_BACKEND_ORIGIN = 'https://farm-connnect-bn0q.onrender.com';

const rawEnvBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || '';

// If VITE_API_URL is not set in production, use known backend origin.
const originOrPath = rawEnvBase || (import.meta.env.PROD ? DEFAULT_PROD_BACKEND_ORIGIN : '');

const removeTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

const ensureApiSuffix = (value: string) => {
  const cleaned = removeTrailingSlashes(value);
  if (!cleaned) return '';
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
};

// Development fallback uses Vite proxy:
// '/api' -> http://localhost:4174 (configured in vite.config.ts)
export const API_BASE_URL = ensureApiSuffix(originOrPath) || '/api';

console.log('[API] API_BASE_URL:', API_BASE_URL);
