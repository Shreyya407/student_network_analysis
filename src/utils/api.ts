/**
 * CampusConnect API Client
 * Supports live FastAPI backend, custom hosted backend URLs via VITE_API_BASE_URL,
 * and automatic graceful static data fallback for static web hosting.
 */

const API_BASE = (((import.meta as any).env?.VITE_API_BASE_URL as string) || '').replace(/\/$/, '');

const STATIC_FALLBACKS: Record<string, string> = {
  '/api/dashboard': '/data/dashboard.json',
  '/api/dataset/validation': '/data/validation.json',
  '/api/students': '/data/students.json',
  '/api/network': '/data/network.json',
  '/api/communities': '/data/communities.json',
  '/api/bridges': '/data/bridges.json',
  '/api/isolated': '/data/isolated.json',
  '/api/connectivity': '/data/connectivity.json',
  '/api/departments': '/data/departments.json',
  '/api/centrality': '/data/centrality.json',
};

export async function fetchApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.split('?')[0];
  const url = API_BASE ? `${API_BASE}${endpoint}` : endpoint;

  try {
    const res = await fetch(url, options);
    if (res.ok) {
      return await res.json();
    }
    // If 404/500 on static host, load bundled data fallback
    if (STATIC_FALLBACKS[cleanEndpoint]) {
      const fallbackRes = await fetch(STATIC_FALLBACKS[cleanEndpoint]);
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    }
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  } catch (err) {
    // If fetch failed completely (e.g., backend not hosted yet), use static fallback
    if (STATIC_FALLBACKS[cleanEndpoint]) {
      const fallbackRes = await fetch(STATIC_FALLBACKS[cleanEndpoint]);
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    }
    throw err;
  }
}
