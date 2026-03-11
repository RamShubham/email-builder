const BASE_URL = process.env.REACT_APP_UNSPLASH_SERVER_URL;

export type UnsplashImage = {
  id: string;
  urls?: { regular?: string; small?: string; full?: string };
  url?: string;
  alt_description?: string;
  user?: { username?: string };
};

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? (window as unknown as { accessToken?: string }).accessToken : undefined;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['token'] = token;
  }
  return headers;
}

export async function searchUnsplash(query: string, page: number): Promise<UnsplashImage[]> {
  if (!BASE_URL) {
    console.warn('REACT_APP_UNSPLASH_SERVER_URL is not set');
    return [];
  }
  try {
    const base = BASE_URL.replace(/\/?$/, '');
    const fullUrl = `${base}/service/v0/unsplash/search`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query, page: page || 1, per_page: 20 }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Search failed');
    }
    if (data?.status === 'success' && data?.result?.results) {
      return data.result.results;
    }
    if (Array.isArray(data?.results)) {
      return data.results;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (err) {
    console.error('Unsplash search error:', err);
    throw err;
  }
}
