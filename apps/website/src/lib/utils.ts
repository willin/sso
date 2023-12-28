export function getRealPath(path: string, locales: string[]): string {
  const reg = new RegExp(locales.map((x) => `/${x}`).join('|'));
  return path.replace(reg, '');
}

export const providerNames = {
  github: 'GitHub',
  afdian: '爱发电(afdian.net)',
  alipay: '支付宝(alipay.com)'
};

export function getProviderName(
  provider: keyof typeof providerNames & string
): string {
  return providerNames?.[provider] || provider;
}
