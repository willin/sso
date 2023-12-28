import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
  const url = new URL(request.url);
  const res = await fetch(`/api/users?${url.searchParams.toString()}`, request);
  const users = await res.json();
  console.log(JSON.stringify(users));
  return {
    users
  };
};
