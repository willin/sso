import clsx from 'classnames';
import { type ActionFunction, json, type LoaderFunction, redirect } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData, useNavigation, useParams } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { checkAdminPermission } from '~/utils/admin-check.server';
import { getLocaleLink } from '~/i18n';
import dayjs from 'dayjs';
import type { FormEvent } from 'react';

export const loader: LoaderFunction = async ({ context, request, params }) => {
  await checkAdminPermission({ context, request });
  if (!params?.id) {
    return json({ app: {} });
  }
  const app = await context.services.app.getAppById(params.id);
  if (!app) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ app });
};

export const action: ActionFunction = async ({ context, request, params }) => {
  await checkAdminPermission({ context, request });
  const formData = await request.formData();
  const { _action, ...body } = Object.fromEntries(formData.entries());
  // create or edit app
  if (_action === 'save') {
    if (!params.id) {
      const app = await context.services.app.createApp({
        ...body,
        production: body.production ? 1 : 0,
        redirectUris: [body.redirect_uris]
      });
      return redirect(getLocaleLink(`/dashboard/app/edit/${app.id}`, params.lang));
    }
    await context.services.app.updateApp(params.id, {
      ...body,
      production: body.production ? 1 : 0,
      redirectUris: [body.redirect_uris]
    });
    return redirect(getLocaleLink(`/dashboard/app/edit/${params.id}`, params.lang));
  }
  // create secret
  if (_action === 'createSecret') {
    const secret = await context.services.app.createSecret(params.id);
    return json({ secret });
  }
  // delete secret
  if (params.id && _action) {
    await context.services.app.deleteSecret(params.id, new Date(_action));
    return redirect(getLocaleLink(`/dashboard/app/edit/${params.id}`, params.lang));
  }
  return json({});
};

export default function EditAppPage() {
  const { id } = useParams();
  const { t } = useI18n();
  const { app } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { state } = useNavigation();

  function confirmDelete(e: FormEvent<HTMLFormElement>) {
    if (!confirm(t('common.confirm_delete'))) {
      e.preventDefault();
      return false;
    }
  }

  return (
    <>
      <h2 className='text-primary text-2xl my-2'>{t(id ? 'app.edit' : 'app.create')}</h2>
      <Form action='.' method='POST' reloadDocument>
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('app.name')}</span>
          </label>
          <input
            type='text'
            name='name'
            placeholder={t('app.name')}
            defaultValue={app.name || ''}
            className='input input-bordered w-full'
          />
        </div>
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('app.description')}</span>
          </label>
          <textarea
            type='text'
            name='description'
            placeholder={t('app.description')}
            defaultValue={app.description || ''}
            className='textarea textarea-bordered h-24 w-full'></textarea>
        </div>
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('app.redirect_uris')}</span>
          </label>
          <input
            type='text'
            name='redirect_uris'
            placeholder={t('app.redirect_uris')}
            defaultValue={Array.isArray(app.redirectUris) ? app.redirectUris.join(',') : app.redirectUris || ''}
            className='input input-bordered w-full'></input>
        </div>
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('app.logo')}</span>
          </label>
          <input
            type='text'
            name='logo'
            placeholder={t('app.logo')}
            defaultValue={app.logo || ''}
            className='input input-bordered w-full'></input>
        </div>
        <div className='form-control w-full my-2'>
          <label className='label'>
            <span className='label-text'>{t('app.homepage')}</span>
          </label>
          <input
            type='text'
            name='homepage'
            placeholder={t('app.homepage')}
            defaultValue={app.homepage || ''}
            className='input input-bordered w-full'></input>
        </div>
        <div className='form-control w-full my-2'>
          <label className='label cursor-pointer'>
            <span className='label-text'>{t('app.production')}</span>
            <input type='checkbox' className='toggle' name='production' defaultChecked={app.production || false} />
          </label>
        </div>
        <div className='form-control w-full my-2'>
          <button
            type='submit'
            name='_action'
            value='save'
            disabled={state !== 'idle'}
            className={clsx('btn btn-primary', {
              'btn-disabled': state !== 'idle'
            })}>
            {t('common.save')}
          </button>
        </div>

        {id && (
          <>
            <h3>{t('app.secret')}</h3>
            <div className='form-control w-full my-2'>
              <ul>
                {app.secret.map((s) => (
                  <li key={s.createdAt}>
                    <div className='alert'>
                      <span>
                        {t('common.created_at')}: {dayjs(s.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                      <div>
                        <button
                          onClick={confirmDelete}
                          name='_action'
                          value={s.createdAt}
                          disabled={state !== 'idle'}
                          className={clsx('btn btn-sm btn-warning', {
                            'btn-disabled': state !== 'idle'
                          })}>
                          {t('common.delete')}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {actionData?.secret && (
              <div className='alert'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='stroke-info shrink-0 w-6 h-6'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                </svg>
                <span>{actionData.secret}</span>
              </div>
            )}
            <div className='form-control w-full my-2'>
              <button
                type='submit'
                name='_action'
                value='createSecret'
                disabled={state !== 'idle'}
                className={clsx('btn btn-secondary', {
                  'btn-disabled': state !== 'idle'
                })}>
                {t('app.create_secret')}
              </button>
            </div>
          </>
        )}
      </Form>
    </>
  );
}
