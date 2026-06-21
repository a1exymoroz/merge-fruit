export function getVerifyEmailPath(token: string): string {
  return `/verify?token=${encodeURIComponent(token)}`;
}
