import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { UserType } from '~/server/services/user';

export const checkAdminPermission = async ({ context, request }: LoaderFunctionArgs) => {
  const user = await context.services.auth.authenticator.isAuthenticated(request);
  if (user.type !== UserType.Admin) {
    throw new Response('Forbbiden', { status: 403 });
  }
};
