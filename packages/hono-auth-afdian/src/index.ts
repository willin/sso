import type { AfdianUser } from './types';

export * from './types';
export { afdianAuth } from './middleware';

declare module 'hono' {
  interface ContextVariableMap {
    'github-user': Partial<AfdianUser> | undefined;
  }
}
