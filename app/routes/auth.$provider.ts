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
    state: url.searchParams.get('state')
  };
  const state = stateObj.client_id ? await auth.createState(stateObj) : undefined;
  return await auth.authenticator.authenticate(provider, request, {
    successRedirect: request.referrer ?? '/dashboard',
    failureRedirect: '/login',
    state
  });
};
