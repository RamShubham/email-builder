export function getAccessToken(): string | undefined {
  return typeof window !== 'undefined'
    ? (window as unknown as { accessToken?: string }).accessToken
    : undefined;
}
