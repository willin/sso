import type { LoaderFunction } from '@remix-run/cloudflare';
import { i18nConfig } from '~/i18n';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const lang = params.lang;

  await context.services.auth.authenticator.isAuthenticated(request, {
    successRedirect: `${lang && lang !== i18nConfig.fallbackLng ? `/${lang}` : ''}/dashboard`,
    failureRedirect: `${lang && lang !== i18nConfig.fallbackLng ? `/${lang}` : ''}/login`
  });
};
