import type { GitHubTokenResponse, GitHubUser } from './types';

export * from './types';
export { githubAuth } from './middleware';

declare module 'hono' {
  interface ContextVariableMap {
    'github-user': Partial<GitHubUser> | undefined;
    'github-token': GitHubTokenResponse | undefined;
  }
}
