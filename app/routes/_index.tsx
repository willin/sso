import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';

// import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare';
// import type { ENV } from '~/types/global';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

type LoaderError = { message: string } | null;

export const loader: LoaderFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.isAuthenticated(request, { successRedirect: '/private' });
  const session = await context.services.auth.sessionStorage.getSession(request.headers.get('Cookie'));
  const error = session.get(context.services.auth.authenticator.sessionErrorKey) as LoaderError;
  const list = await context.services.views.list();
  return json({ list, error });
};

export default function Index() {
  const { error, list } = useLoaderData<typeof loader>();

  return (
    <div>
      <Form method='post' action='/auth/github'>
        {error ? <div>{error.message}</div> : null}
        <button>Sign In with GitHub</button>
      </Form>
      <pre>{JSON.stringify(list, null, 2)}</pre>
    </div>
  );
}
