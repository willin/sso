import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';
import { UserType } from '~/server/services/user';

export const loader: LoaderFunction = async ({ request, context }) => {
  const { auth, app } = context.services;
  const user = await auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });
  if (user.type !== UserType.Admin) {
    throw new Response('Forbbiden', { status: 403 });
  }
  const apps = await app.listApps();

  return json({ user, apps });
};

export default function Screen() {
  const { apps } = useLoaderData<typeof loader>();
  const { t } = useI18n();

  return (
    <>
      <table className='table table-zebra w-full min-w-full'>
        <thead>
          <tr>
            <th>{t('app.name')}</th>
            <th>{t('app.production')}</th>
            <th>{t('app.homepage')}</th>
            <th>{t('common.created_at')}</th>
            <th>
              <LocaleLink to='/dashboard/app/edit' className='btn btn-sm btn-circle'>
                +
              </LocaleLink>
            </th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id}>
              <td>{app.name}</td>
              <td>{app.production ? '√' : '×'}</td>
              <td>
                <a href={app.homepage} target='_blank' rel='noreferrer'>
                  {app.homepage}
                </a>
              </td>
              <td>{app.createdAt.toLocaleString()}</td>
              <td>Edit Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
