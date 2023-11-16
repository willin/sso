import { redirect, type ActionFunction, type LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';

export const loader: LoaderFunction = () => {
  return redirect('/login');
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const provider = z.enum(['github', 'afdian']).parse(params.provider);
  const url = new URL(request.url);
  const { auth } = context.services;
  const stateObj = {
    client_id: url.searchParams.get('client_id'),
    redirect_uri: url.searchParams.get('redirect_uri') ?? '/dashboard',
    state: url.searchParams.get('state'),
    lang: url.searchParams.get('lang')
  };
  const user = await auth.authenticator.isAuthenticated(request);
  if (user) {
    const search = new URLSearchParams();
    search.append('client_id', stateObj.client_id);
    search.append('redirect_uri', stateObj.redirect_uri);
    search.append('state', stateObj.state);
    return redirect(`/authorize?${search.toString()}`);
  }
  const state = stateObj.client_id ? await auth.createState(stateObj) : undefined;
  return await auth.authenticator.authenticate(provider, request, {
    successRedirect: '/dashboard', // useless
    failureRedirect: '/login',
    state
  });
};
