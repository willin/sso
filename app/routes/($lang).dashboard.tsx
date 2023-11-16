import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';

export const action: ActionFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.logout(request, { redirectTo: '/' });
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });

  return json({ user });
};

export default function Screen() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      <Form method='post'>
        <button>Log Out</button>
      </Form>

      <hr />

      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </>
  );
}
