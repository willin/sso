import type { AlipayTokenResponse, AlipayUser } from './types';

export * from './types';
export { alipayAuth } from './middleware';

declare module 'hono' {
  interface ContextVariableMap {
    'alipay-user': AlipayUser | undefined;
    'alipay-token': AlipayTokenResponse | undefined;
  }
}
