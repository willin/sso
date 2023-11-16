import { redirect, type LoaderFunction } from '@remix-run/cloudflare';
import { safeRedirect } from '~/utils/safe-redirect';

export const loader: LoaderFunction = async ({ request, context }) => {
  const { auth } = context.services;
  const { authenticator } = auth;
  const user = await authenticator.isAuthenticated(request);
  const url = new URL(request.url);
  const search = new URLSearchParams();
  const clientId = url.searchParams.get('client_id');
  search.append('state', url.searchParams.get('state'));
  if (!user) {
    search.append('client_id', clientId);
    search.append('redirect_uri', url.searchParams.get('redirect_uri'));
    return redirect(`/login?${search.toString()}`);
  }
  // callback with code
  search.append('code', await auth.createCode(clientId, user));
  const lang = url.searchParams.get('lang');

  return redirect(
    safeRedirect(
      `${url.searchParams.get('redirect_uri')}?${search.toString()}`,
      `${lang && lang !== i18nConfig.fallbackLng ? `/${lang}` : ''}/dashboard`
    )
  );
};

export { ErrorBoundary } from './_auth';
