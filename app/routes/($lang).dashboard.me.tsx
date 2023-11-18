import clsx from 'classnames';
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import dayjs from 'dayjs';

export const loader: LoaderFunction = async ({ request, context }) => {
  const login = await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });
  const user = await context.services.user.getUserById(login.id);
  const thirdparty = await context.services.user.getThirdUsersByUserId(login.id);
  return json(
    { user, thirdparty },
    {
      headers: {
        'set-cookie': await context.services.auth.redirectCookieStorage.serialize(request.url)
      }
    }
  );
};

export const action: ActionFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });
  const formData = await request.formData();
  const { id, _action, ...body } = Object.fromEntries(formData.entries());
  if (_action === 'save') {
    await context.services.user.updateUser(id, body);
    return json({});
  }
  if (_action === 'unbind') {
    await context.services.user.unbindThirdUser(id, body.provider);
    return json({});
  }
  if (_action === 'bind') {
    return redirect(context.services.auth.bindThirdPartyRedirect(body.provider));
  }
  return json({});
};

export default function DashboardPage() {
  const { user, thirdparty } = useLoaderData<typeof loader>();
  const { t } = useI18n();
  const { state } = useNavigation();
  const thirdGithub = thirdparty.find((t) => t.provider === 'github');
  const thirdAfdian = thirdparty.find((t) => t.provider === 'afdian');

  return (
    <>
      <Form action='.' method='POST' reloadDocument>
        <input type='hidden' name='id' value={user.id} />
        <input type='hidden' name='_action' value='save' />
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
            <span className='label-text'>{t('user.display_name')}</span>
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
      <h3 className='my-4'>{t('user.thirdparty')}</h3>
      <div className='card w-full my-4 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>Github</h2>
          <p>{thirdGithub && `${t('common.created_at')}： ${dayjs(thirdGithub.createdAt).format('YYYY-MM-DD')}`}</p>
          <div className='card-actions justify-end'>
            {!thirdGithub && (
              <Form action='.' method='POST' reloadDocument>
                <input type='hidden' name='id' value={user.id} />
                <input type='hidden' name='_action' value='bind' />
                <div className='form-control w-full my-2'>
                  <button type='submit' name='provider' value='github' className='btn btn-primary'>
                    {t('user.bind')}
                  </button>
                </div>
              </Form>
            )}
            {thirdGithub && thirdparty.length > 1 && (
              <Form action='.' method='POST' reloadDocument>
                <input type='hidden' name='id' value={user.id} />
                <input type='hidden' name='_action' value='unbind' />
                <div className='form-control w-full my-2'>
                  <button type='submit' name='provider' value='github' className='btn btn-primary'>
                    {t('user.unbind')}
                  </button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
      <div className='card w-full my-4 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>爱发电(afdian.net)</h2>
          <p>{thirdAfdian && `${t('common.created_at')}： ${dayjs(thirdAfdian.createdAt).format('YYYY-MM-DD')}`}</p>
          <div className='card-actions justify-end'>
            {!thirdAfdian && (
              <Form action='.' method='POST' reloadDocument>
                <input type='hidden' name='id' value={user.id} />
                <input type='hidden' name='_action' value='bind' />
                <div className='form-control w-full my-2'>
                  <button type='submit' name='provider' value='afdian' className='btn btn-secondary'>
                    {t('user.bind')}
                  </button>
                </div>
              </Form>
            )}
            {thirdAfdian && thirdparty.length > 1 && (
              <Form action='.' method='POST' reloadDocument>
                <input type='hidden' name='id' value={user.id} />
                <input type='hidden' name='_action' value='unbind' />
                <div className='form-control w-full my-2'>
                  <button type='submit' name='provider' value='afdian' className='btn btn-secondary'>
                    {t('user.unbind')}
                  </button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
