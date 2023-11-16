import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useSearchParams } from '@remix-run/react';

export const action: ActionFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.logout(request, { redirectTo: '/login' });
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(request);
  if (user) {
    // redirect callback or dashboard
  }
  return json({});
};

export default function Screen() {
  const [searchParams] = useSearchParams();

  return (
    <>
      <Form method='post'>
        <button>Log Out</button>
      </Form>
      <Form method='post' action={`/auth/github?${searchParams.toString()}`}>
        <button>Sign In with GitHub</button>
      </Form>
      <Form method='post' action={`/auth/afdian?${searchParams.toString()}`}>
        <button>Sign In with Afdian(爱发电)</button>
      </Form>
    </>
  );
}
