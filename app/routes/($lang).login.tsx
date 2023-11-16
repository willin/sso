import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { useI18n } from 'remix-i18n';

export const action: ActionFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.logout(request, { redirectTo: '/login' });
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(request);
  if (user) {
    return redirect(`${params.lang ? `/${lang}` : ''}/dashboard`);
  }
  return json({});
};

export default function Screen() {
  const i18n = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set('lang', i18n.locale());
      return prev;
    });
  }, [i18n, setSearchParams]);

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
