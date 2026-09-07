import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // ─── PERFORMANCE: 10 second timeout to avoid hanging requests ────────
  timeout: 10000,
});

// ─── PERFORMANCE: In-memory response cache (GET requests only) ──────────
// Caches GET responses for 30 seconds to avoid duplicate API calls
// when multiple components mount and fetch the same data simultaneously.
const _cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL_MS = 30_000; // 30 seconds

const _originalGet = api.get.bind(api);

api.get = function cachedGet(url: string, config?: any): any {
  // Skip cache for authenticated/personalised or non-cacheable endpoints
  const skipCachePaths = ["/auth", "/bookings", "/leads", "/queries", "/upload", "/dashboard", "/reviews"];
  const shouldSkip = skipCachePaths.some((p) => url.startsWith(p));

  const cacheKey = url + (config?.params ? JSON.stringify(config.params) : "");

  if (!shouldSkip) {
    const cached = _cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return Promise.resolve(cached.data);
    }
  }

  return _originalGet(url, config).then((res: any) => {
    if (!shouldSkip) {
      _cache.set(cacheKey, { data: res, ts: Date.now() });
    }
    return res;
  });
} as typeof api.get;

// ─── Clear cache when auth token changes (login/logout) ─────────────────
api.interceptors.request.use((config) => {
  if (config.method === "post" || config.method === "put" || config.method === "patch" || config.method === "delete") {
    // Invalidate all cached GET results when data is mutated
    _cache.clear();
  }
  return config;
});
