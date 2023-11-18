import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData, useSearchParams } from '@remix-run/react';
import dayjs from 'dayjs';
import type { FormEvent } from 'react';
import { useI18n } from 'remix-i18n';
// import { LocaleLink } from '~/components/link';
import { Paginator } from '~/components/pagination';
import { checkAdminPermission } from '~/utils/admin-check.server';

export const loader: LoaderFunction = async ({ request, context }) => {
  await checkAdminPermission({ context, request });
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 20;
  const forbidden = Number(searchParams.get('forbidden')) || 0;
  const result = await context.services.user.listUsers({ page, size, forbidden });
  return json(result);
};

export const action: ActionFunction = async ({ request, context }) => {
  await checkAdminPermission({ context, request });
  const formData = await request.formData();
  const forbidden = Number(formData.get('forbidden')) || 0;
  const userId = formData.get('id');
  await context.services.user.changeUserForbidden(userId, forbidden === 0 ? 1 : 0);
  return json({});
};

export default function UserListPage() {
  const { data: users, total } = useLoaderData<typeof loader>();
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  function confirmOperation(e: FormEvent<HTMLFormElement>) {
    if (!confirm(t('common.confirm'))) {
      e.preventDefault();
      return false;
    }
  }

  return (
    <>
      <Form action='.?index' method='POST' reloadDocument>
        <input type='hidden' name='forbidden' value={searchParams.get('forbidden')} />
        <table className='table table-zebra w-full min-w-full'>
          <thead>
            <tr>
              <th>{t('user.avatar')}</th>
              <th>{t('user.username')}</th>
              <th>{t('user.display_name')}</th>
              <th>{t('user.type')}</th>
              <th>{t('common.created_at')}</th>
              <th>
                <select
                  className='select select-bordered'
                  onChange={(e: FormEvent<HTMLFormElement>) => {
                    setSearchParams((s) => {
                      s.set('forbidden', e.target.value);
                      return s;
                    });
                  }}
                  defaultValue={searchParams.get('forbidden') || '0'}>
                  <option value='0'>{t('user.normal')}</option>
                  <option value='1'>{t('user.forbidden')}</option>
                </select>
              </th>
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
                  <button type='submit' onClick={confirmOperation} name='id' value={user.id}>
                    {searchParams.get('forbidden') === '1' ? t('user.unban') : t('user.ban')}
                  </button>
                  {/* <LocaleLink to={`/dashboard/user/edit/${user.id}`}>{t('common.edit')}</LocaleLink> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Paginator total={total} />
      </Form>
    </>
  );
}
