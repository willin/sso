import { redirect, type LoaderFunction } from '@remix-run/cloudflare';
import { safeRedirect } from '~/utils/safe-redirect';

export const loader: LoaderFunction = async ({ request, context }) => {
  const { authenticator } = context.services.auth;
  const user = await authenticator.isAuthenticated(request);
  const url = new URL(request.url);
  const search = new URLSearchParams();
  search.append('state', url.searchParams.get('state'));
  if (!user) {
    search.append('client_id', url.searchParams.get('client_id'));
    search.append('redirect_uri', url.searchParams.get('redirect_uri'));
    return redirect(`/login?${search.toString()}`);
  }
  // callback with code
  search.append('code', 'xxx');
  return redirect(safeRedirect(`${url.searchParams.get('redirect_uri')}?${search.toString()}`, '/dashboard'));
};
