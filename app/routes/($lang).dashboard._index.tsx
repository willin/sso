import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';
import { UserType } from '~/server/services/user';

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });

  return json({ user });
};

export default function Screen() {
  const { user } = useLoaderData<typeof loader>();
  const { t } = useI18n();

  return (
    <>
      <Form method='post' action='/api/logout'>
        <button>Log Out</button>
      </Form>
      {user.type === UserType.Admin && <LocaleLink to='/dashboard/app'>{t('app.management')}</LocaleLink>}
      <hr />
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </>
  );
}
