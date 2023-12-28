import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, request }) => {
  const url = new URL(request.url);
  const res = await fetch(`${url.origin}/auth/userinfo`, request);
  const text = await res.text();
  console.log(text);
  try {
    const user = JSON.parse(text);
    if (!user || user.error) {
      return {};
    }
    return { user };
  } catch (e) {
    //
  }
  return {};
};
