import type { LoaderFunction } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async ({ request, context }) => {
  return await context.services.auth.authenticator.authenticate('github', request, {
    successRedirect: '/private',
    failureRedirect: '/'
  });
};
