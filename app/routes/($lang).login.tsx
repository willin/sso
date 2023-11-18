import type { LoaderFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Form, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { useI18n } from 'remix-i18n';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(request);
  const url = new URL(request.url);
  if (user) {
    const clientId = url.searchParams.get('client_id');
    if (clientId) {
      const search = new URLSearchParams();
      search.append('client_id', clientId);
      search.append('redirect_uri', url.searchParams.get('redirect_uri'));
      search.append('state', url.searchParams.get('state'));
      return redirect(`/authorize?${search.toString()}`);
    }
    return redirect(`${params.lang ? `/${lang}` : ''}/dashboard`);
  }
  return json({});
};

export default function Screen() {
  const i18n = useI18n();
  const [, setSearchParams] = useSearchParams();
  const { t } = i18n;
  useEffect(() => {
    setSearchParams((prev) => {
      prev.set('lang', i18n.locale());
      return prev;
    });
  }, [i18n, setSearchParams]);

  return (
    <>
      <Form method='post' action={`/auth/github`}>
        <div className='form-control w-full my-2'>
          <button type='submit' className='btn btn-primary'>
            {t('common.login_with', { provider: 'GitHub' })}
          </button>
        </div>
      </Form>
      <Form method='post' action={`/auth/afdian`}>
        <div className='form-control w-full my-2'>
          <button type='submit' className='btn btn-secondary'>
            {t('common.login_with', { provider: '爱发电(afdian.net)' })}
          </button>
        </div>
      </Form>
    </>
  );
}
