import type { IncomingHttpHeaders } from 'http';

type UploadImageParams = {
  bytes: Buffer;
  mimeType: string;
  name: string;
};

export function generateImageName(imageDescription: string) {
  return `${imageDescription.slice(0, 50).split(' ').join('_')}_${Date.now()}.png`;
}

export async function uploadImageToCdn(
  { bytes, mimeType, name }: UploadImageParams,
  token?: IncomingHttpHeaders['authorization'] | string
): Promise<string> {
  const baseUrl = process.env.UPLOAD_URL;

  if (!baseUrl) {
    throw new Error('UPLOAD_URL environment variable is not set');
  }

  try {
    const handshakeResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { token: String(token) } : {}),
      },
      body: JSON.stringify({
        fileName: name,
        fileType: mimeType,
      }),
    });

    if (!handshakeResponse.ok) {
      let errorDetail: string | undefined;
      try {
        const body = await handshakeResponse.text();
        errorDetail = body;
      } catch {
        // ignore body parsing errors
      }
      throw new Error(
        `Failed to get upload URL from CDN service (status ${handshakeResponse.status})${errorDetail ? `: ${errorDetail}` : ''
        }`
      );
    }

    const handshakeData: { cdn?: string; upload?: string } = await handshakeResponse.json();
    const { cdn, upload } = handshakeData;

    if (!cdn || !upload) {
      throw new Error('Invalid response from CDN service: missing cdn or upload URL');
    }

    const uploadResponse = await fetch(upload, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        ...(token ? { token: String(token) } : {}),
      },
      // Node's fetch expects a BodyInit; Buffer is a Uint8Array subclass at runtime,
      // but its TypeScript type is not assignable, so we cast here.
      body: bytes as unknown as BodyInit,
    });

    if (!uploadResponse.ok) {
      let errorDetail: string | undefined;
      try {
        const body = await uploadResponse.text();
        errorDetail = body;
      } catch {
        // ignore body parsing errors
      }
      throw new Error(
        `Failed to upload image bytes to CDN (status ${uploadResponse.status})${errorDetail ? `: ${errorDetail}` : ''
        }`
      );
    }

    return cdn;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload image to CDN: ${error.message}`);
    }
    throw new Error('Failed to upload image to CDN');
  }
}

