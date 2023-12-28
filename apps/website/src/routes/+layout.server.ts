import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, request }) => {
  const url = new URL(request.url);
  const res = await fetch(`${url.origin}/auth/userinfo`, request);
  const user = await res.json();
  if (!user || user.error) {
    return {};
  }
  return { user };
};
