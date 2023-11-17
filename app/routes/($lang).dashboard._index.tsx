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

  function confirmLogout(e: FormEvent<HTMLFormElement>) {
    if (!confirm(t('common.confirm_logout'))) {
      e.preventDefault();
      return false;
    }
  }

  return (
    <>
      <Form method='post' action='/api/logout'>
        <LocaleLink to='/me'>{user.username}</LocaleLink>
        {user.type === UserType.Admin && (
          <LocaleLink to='/dashboard/app' className='my-2 mx-2'>
            {t('app.management')}
          </LocaleLink>
        )}
        {user.type === UserType.Admin && (
          <LocaleLink to='/dashboard/user' className='my-2 mx-2'>
            {t('user.management')}
          </LocaleLink>
        )}
        <button className='m-2' type='submit' onClick={confirmLogout}>
          {t('common.logout')}
        </button>
      </Form>
    </>
  );
}
