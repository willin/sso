import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';
import type { App } from '~/server/services/app';
import { UserType } from '~/server/services/user';

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });

  const apps = await context.services.app.listApps();

  return json({ user, apps: apps.filter((x) => x.production) });
};

export default function DashboardPage() {
  const { user, apps } = useLoaderData<typeof loader>();
  const { t } = useI18n();

  function confirmLogout(e: FormEvent<HTMLFormElement>) {
    if (!confirm(t('common.confirm_logout'))) {
      e.preventDefault();
      return false;
    }
  }

  function appLogin(app: App) {
    const search = new URLSearchParams();
    search.append('client_id', app.id);
    search.append('redirect_uri', app.redirectUris[0]);
    search.append('state', Date.now());
    window.open(`/authorize?${search.toString()}`);
  }

  return (
    <>
      <Form method='post' action='/api/logout'>
        <LocaleLink to='/dashboard/me'>{user.username}</LocaleLink>
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

      <div>
        {apps.map((app) => (
          <div key={app.id} className='card card-side w-full my-4 bg-base-100 shadow-xl'>
            <figure>
              <img
                src={app.logo.startsWith('http') ? app.logo : '/images/logo.jpg'}
                alt={app.name}
                className='w-32 rounded'
              />
            </figure>

            <div className='card-body'>
              <h2 className='card-title'>{app.name}</h2>
              <p>{app.description}</p>
              <p>
                {t('app.homepage')}： {app.homepage}
              </p>
              <div className='card-actions justify-end'>
                <button onClick={() => appLogin(app)} className='btn btn-primary'>
                  {t('common.login')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
