import type { LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const provider = z.enum(['github', 'afdian']).parse(params.provider);

  return await context.services.auth.authenticator.authenticate(provider, request, {
    successRedirect: '/demo',
    failureRedirect: '/login'
  });
};
