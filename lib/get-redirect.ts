export function getSafeRedirect(value: string | null | undefined): string {
  if (!value) return "/";
  // Solo se permiten rutas internas para evitar open-redirects.
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
