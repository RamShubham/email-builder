const BASE_URL = process.env.REACT_APP_FILE_UPLOAD_SERVER;

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? (window as unknown as { accessToken?: string }).accessToken : undefined;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function uploadFile(file: File): Promise<string> {
  if (!BASE_URL) {
    throw new Error('REACT_APP_FILE_UPLOAD_SERVER is not set');
  }
  const fileName = file.name;
  const fileType = file.name.split('.').pop() || '';

  const response = await fetch(`${BASE_URL.replace(/\/?$/, '')}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ fileName, fileType }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Upload request failed');
  }

  const uploadUrl = data.upload;
  const cdnUrl = data.cdn;

  if (!uploadUrl || !cdnUrl) {
    throw new Error('Invalid upload response: missing upload or cdn URL');
  }

  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    redirect: 'follow',
  });

  return cdnUrl;
}
