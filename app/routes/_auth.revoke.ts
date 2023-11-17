import { type LoaderFunction, type ActionFunction, redirect, json } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async () => {
  return redirect(`/login`);
};

export const action: ActionFunction = async ({ context, request }) => {
  const form = await request.formData();
  const body = Object.fromEntries(form.entries());
  const { client_id: clientId, token, client_secret: clientSecret } = body;
  if (!clientId || !token || !clientSecret) {
    throw new Response('invalid_request', {
      status: 400
    });
  }
  const { app, auth } = context.services;
  const secrets = await app.getAppSecrets(clientId);
  if (!secrets.includes(clientSecret)) {
    throw new Response('invalid_client', {
      status: 401
    });
  }
  await auth.revokeToken(token);
  return json({});
};
