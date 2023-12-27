import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, request }) => {
  const res = await fetch('/auth/userinfo', request);
  const user = await res.json();
  if (!user || user.error) {
    return {};
  }
  return { user };
};
