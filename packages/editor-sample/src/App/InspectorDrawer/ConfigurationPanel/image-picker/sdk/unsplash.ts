import Search from 'oute-services-search-sdk';

import { getAccessToken } from './getAccessToken';

export type UnsplashImage = {
  id: string;
  urls?: { regular?: string; small?: string; full?: string };
  url?: string;
  alt_description?: string;
  user?: { username?: string };
};

export function searchInstance() {
  const url = process.env.REACT_APP_UNSPLASH_SERVER_URL;
  if (!url) {
    throw new Error('REACT_APP_UNSPLASH_SERVER_URL is not set');
  }
  return new Search({ url, token: getAccessToken() });
}

export async function getImagesFromUnsplash({
  query,
  page,
}: {
  query: string;
  page?: number;
}): Promise<UnsplashImage[]> {
  const search = searchInstance();
  const response = await search.searchImage({
    query,
    page: page || 1,
    per_page: 20,
  });

  if (response?.status !== 'success') {
    throw new Error(response?.result?.message || 'Unsplash search failed');
  }

  return response?.result?.results || [];
}
