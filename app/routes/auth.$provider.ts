import { redirect, type ActionFunction, type LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';

export const loader: LoaderFunction = () => {
  return redirect('/login');
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const provider = z.enum(['github', 'afdian']).parse(params.provider);

  return await context.services.auth.authenticator.authenticate(provider, request, {
    successRedirect: '/demo',
    failureRedirect: '/login'
  });
};
