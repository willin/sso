import type { LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const provider = z.enum(['github', 'afdian']).parse(params.provider);
  const url = new URL(request.url);

  const { auth } = context.services;

  const state = await auth.getState(url.searchParams.get('state'));
  let redirectUrl = '/dashboard';
  if (state) {
    const search = new URLSearchParams();
    search.append('client_id', state.client_id);
    search.append('redirect_uri', state.redirect_uri);
    search.append('state', state.state);
    redirectUrl = `/authorize?${search.toString()}`;
  }

  return await auth.authenticator.authenticate(provider, request, {
    successRedirect: redirectUrl,
    failureRedirect: '/login'
  });
};
