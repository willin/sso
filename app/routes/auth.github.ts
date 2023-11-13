import type { ActionFunction } from '@remix-run/cloudflare';

export const action: ActionFunction = async ({ request, context }) => {
  return await context.services.auth.authenticator.authenticate('github', request, {
    successRedirect: '/private',
    failureRedirect: '/'
  });
};
