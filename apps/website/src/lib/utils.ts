export function getRealPath(path: string, locales: string[]): string {
  const reg = new RegExp(locales.map((x) => `/${x}`).join('|'));
  return path.replace(reg, '');
}
