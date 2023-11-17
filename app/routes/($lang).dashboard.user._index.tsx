import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';
import { Paginator } from '~/components/pagination';
import { checkAdminPermission } from '~/utils/admin-check.server';

export const loader: LoaderFunction = async ({ request, context }) => {
  await checkAdminPermission({ context, request });
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 20;
  const result = await context.services.user.listUsers(page, size);
  return json(result);
};

export default function Screen() {
  const { data: users, total } = useLoaderData<typeof loader>();
  const { t } = useI18n();

  return (
    <>
      <table className='table table-zebra w-full min-w-full'>
        <thead>
          <tr>
            <th>{t('user.avatar')}</th>
            <th>{t('user.username')}</th>
            <th>{t('user.display_name')}</th>
            <th>{t('user.type')}</th>
            <th>{t('common.created_at')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className='avatar'>
                  <div className='w-8 rounded'>
                    <img src={user.avatar} alt={user.displayName} />
                  </div>
                </div>
              </td>
              <td>{user.username}</td>
              <td>{user.displayName}</td>
              <td>{t(`user.${user.type}`)}</td>
              <td>{dayjs(user.createdAt).format('YYYY-MM-DD')}</td>
              <td>
                <LocaleLink to={`/dashboard/user/edit/${user.id}`}>{t('common.edit')}</LocaleLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator total={total} />
    </>
  );
}
