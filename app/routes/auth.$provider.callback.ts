import type { LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';
import { i18nConfig } from '~/i18n';
import { safeRedirect } from '~/utils/safe-redirect';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const provider = z.enum(['github', 'afdian']).parse(params.provider);

  const { auth } = context.services;
  const returnTo = await auth.redirectCookieStorage.parse(request.headers.get('cookie'));
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang');

  return await auth.authenticator.authenticate(provider, request, {
    successRedirect: safeRedirect(returnTo, `${lang && lang !== i18nConfig.fallbackLng ? `/${lang}` : ''}/dashboard`),
    failureRedirect: '/login'
  });
};
