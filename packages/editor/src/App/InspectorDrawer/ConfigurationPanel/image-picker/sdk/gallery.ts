import UserPhotos from 'oute-services-user-photos-sdk';

import { getAccessToken } from './getAccessToken';

export type GalleryImage = {
  _id: string;
  url: string;
  name: string;
  workspace_id: string;
  [key: string]: unknown;
};

export type GalleryListResult = {
  docs: GalleryImage[];
  has_next_page: boolean;
};

function getUserPhotosClient() {
  const url = process.env.REACT_APP_OUTE_SERVER;
  if (!url) {
    throw new Error('REACT_APP_OUTE_SERVER is not set');
  }
  return new UserPhotos({ url, token: getAccessToken() });
}

export async function listImages({
  workspace_id,
  page,
  limit,
}: {
  workspace_id: string;
  page: number;
  limit: number;
}): Promise<GalleryListResult> {
  const client = getUserPhotosClient();
  const response = await client.getList({
    workspace_id,
    limit,
    page,
    sort_by: 'created_at',
    sort_type: 'desc',
  });

  return response?.result as GalleryListResult;
}

export async function saveImage({
  name,
  url,
  workspace_id,
}: {
  name: string;
  url: string;
  workspace_id: string;
}) {
  const client = getUserPhotosClient();
  const response = await client.save({
    name,
    url,
    workspace_id,
  });

  if (!response || response.status !== 'success') {
    // eslint-disable-next-line no-console
    console.error('Gallery save error:', response);
    throw new Error(response?.result?.message || 'Failed to save image');
  }

  return response;
}
