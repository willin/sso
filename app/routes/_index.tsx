import type { LoaderFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  await context.services.auth.authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  });
};
