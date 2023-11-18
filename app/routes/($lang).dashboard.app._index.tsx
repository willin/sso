import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';
import { checkAdminPermission } from '~/utils/admin-check.server';

export const loader: LoaderFunction = async ({ request, context }) => {
  await checkAdminPermission({ context, request });
  const apps = await context.services.app.listApps();
  return json({ apps });
};

export default function AppListPage() {
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
              <td>
                <input type='checkbox' checked={app.production} className='checkbox checkbox-primary' readOnly />
              </td>
              <td>
                <a href={app.homepage} target='_blank' rel='noreferrer'>
                  {app.homepage}
                </a>
              </td>
              <td>{dayjs(app.createdAt).format('YYYY-MM-DD')}</td>
              <td>
                <LocaleLink to={`/dashboard/app/edit/${app.id}`}>{t('common.edit')}</LocaleLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
