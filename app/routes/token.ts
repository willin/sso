import { type LoaderFunction, type ActionFunction, redirect, json } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async () => {
  return redirect(`/login`);
};

export const action: ActionFunction = async ({ context, request }) => {
  const form = await request.formData();
  const body = Object.fromEntries(form.entries());
  const { client_id: clientId, code, client_secret: clientSecret } = body;
  if (!clientId || !code || !clientSecret) {
    // TODO: err1
  }
  const { app, auth } = context.services;
  const secrets = await app.getAppSecrets(clientId);
  if (!secrets.includes(clientSecret)) {
    // TODO: err2
  }
  const user = await auth.getUserfromCode(clientId, code);
  if (!user) {
    // TODO: err3
  }
  await auth.deleteCode(clientId, code);

  const token = await auth.createToken(user);
  return json(token);
};
