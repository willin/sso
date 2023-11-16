import { type LoaderFunction, json } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async ({ context, request }) => {
  const { auth } = context.services;
  const token = (request.headers.get('authorization') || '').replace(/^bearer\s/i, '');
  const user = await auth.getUserFromToken(token);
  if (!user) {
    throw new Response('invalid_token', {
      status: 403
    });
  }
  return json(user);
};

export { ErrorBoundary } from './_auth';
