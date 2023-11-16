import type { LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';
import { safeRedirect } from '~/utils/safe-redirect';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const provider = z.enum(['github', 'afdian']).parse(params.provider);

  const { auth } = context.services;
  const returnTo = await auth.redirectCookieStorage.parse(request.headers.get('cookie'));
  console.log(returnTo);

  return await auth.authenticator.authenticate(provider, request, {
    successRedirect: safeRedirect(returnTo, '/'),
    failureRedirect: '/login'
  });
};
