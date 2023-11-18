import { type LoaderFunction, json } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async ({ context, request }) => {
  const { auth } = context.services;
  const token = (request.headers.get('authorization') || '').replace(/^bearer\s/i, '');
  const login = await auth.getUserFromToken(token);
  if (!login) {
    throw new Response('invalid_token', {
      status: 403
    });
  }
  const user = await context.services.user.getUserById(login.id);
  const thirdparty = await context.services.user.getThirdUsersByUserId(login.id);
  return json({ ...user, thirdparty });
};
