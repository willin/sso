import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';

export const action: ActionFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.logout(request, { redirectTo: '/login' });
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const profile = await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });

  return json({ profile });
};

export default function Screen() {
  const { profile } = useLoaderData<typeof loader>();
  return (
    <>
      <Form method='post'>
        <button>Log Out</button>
      </Form>

      <hr />

      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
    </>
  );
}
