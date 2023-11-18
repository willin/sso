import clsx from 'classnames';
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import { useI18n } from 'remix-i18n';

export const loader: LoaderFunction = async ({ request, context }) => {
  const login = await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });
  const user = await context.services.user.getUserById(login.id);
  return json({ user });
};

export const action: ActionFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });
  const formData = await request.formData();
  const { id, ...body } = Object.fromEntries(formData.entries());
  await context.services.user.updateUser(id, body);
  return json({});
};

export default function DashboardPage() {
  const { user } = useLoaderData<typeof loader>();
  const { t } = useI18n();
  const { state } = useNavigation();

  return (
    <>
      <Form action='.' method='POST' reloadDocument>
        <input type='hidden' name='id' value={user.id} />
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('user.username')}</span>
          </label>
          <input
            type='text'
            name='username'
            placeholder={t('user.username')}
            defaultValue={user.username || ''}
            className='input input-bordered w-full'
          />
        </div>
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('user.username')}</span>
          </label>
          <input
            type='text'
            name='displayName'
            placeholder={t('user.display_name')}
            defaultValue={user.displayName || ''}
            className='input input-bordered w-full'
          />
        </div>
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('user.avatar')}</span>
          </label>
          <input
            type='text'
            name='avatar'
            placeholder={t('user.avatar')}
            defaultValue={user.avatar || ''}
            className='input input-bordered w-full'
          />
          <div className='form-control w-full my-2'>
            <button
              type='submit'
              disabled={state !== 'idle'}
              className={clsx('btn btn-primary', {
                'btn-disabled': state !== 'idle'
              })}>
              {t('common.save')}
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}
