const BASE_URL = process.env.REACT_APP_OUTE_SERVER;

export type GalleryImage = {
  _id: string;
  url: string;
  name?: string;
  [key: string]: unknown;
};

export type ListImagesResult = {
  docs: GalleryImage[];
  has_next_page: boolean;
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

export async function listImages(
  workspaceId: string,
  page: number,
  limit: number
): Promise<ListImagesResult> {
  if (!BASE_URL) {
    throw new Error('REACT_APP_OUTE_SERVER is not set');
  }
  try {
    const base = BASE_URL.replace(/\/?$/, '');
    const url = `${base}/api/workspaces/${workspaceId}/images?page=${page}&limit=${limit}&sort_by=created_at&sort_type=desc`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Failed to load gallery');
    }
    const docs = data?.result?.docs ?? data?.docs ?? (Array.isArray(data) ? data : []);
    const has_next_page = data?.result?.has_next_page ?? data?.has_next_page ?? false;
    return { docs, has_next_page };
  } catch (err) {
    console.error('Gallery list error:', err);
    throw err;
  }
}
