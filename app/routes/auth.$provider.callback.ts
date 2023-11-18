import { redirect, type LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';
import { AvailableProviders } from '~/config';
import { i18nConfig } from '~/i18n';
import { safeRedirect } from '~/utils/safe-redirect';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const provider = z.enum(AvailableProviders).parse(params.provider);

  const { auth } = context.services;
  const returnTo = await auth.redirectCookieStorage.parse(request.headers.get('cookie'));
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang');
  if (returnTo.includes('/dashboard/me')) {
    // bind third login
    const user = await auth.authenticator.isAuthenticated(request, { failureRedirect: '/login' });
    await auth.bindThirdPartyCallback(user.id, provider, request);
    return redirect(safeRedirect(returnTo, `${lang && lang !== i18nConfig.fallbackLng ? `/${lang}` : ''}/dashboard`));
  }

  return await auth.authenticator.authenticate(provider, request, {
    successRedirect: safeRedirect(returnTo, `${lang && lang !== i18nConfig.fallbackLng ? `/${lang}` : ''}/dashboard`),
    failureRedirect: '/login'
  });
};
