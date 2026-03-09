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
