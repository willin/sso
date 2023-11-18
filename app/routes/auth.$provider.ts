import { redirect, type ActionFunction, type LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';
import { AvailableProviders } from '~/config';
import { safeRedirect } from '~/utils/safe-redirect';

export const loader: LoaderFunction = () => {
  return redirect('/login');
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const provider = z.enum(AvailableProviders).parse(params.provider);
  const { auth } = context.services;
  let referrer = request.headers.get('referer'); // the typo on referee is correct here https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
  try {
    await auth.authenticator.authenticate(provider, request, {
      successRedirect: safeRedirect(referrer, '/'),
      failureRedirect: '/login'
    });
  } catch (exception) {
    // catch the thrown redirect and append a set-cookie header
    if (exception instanceof Response) {
      // use append and not set, otherwise it will remove any other set-cookie
      exception.headers.append('set-cookie', await auth.redirectCookieStorage.serialize(referrer));
    }
    throw exception;
  }
};
