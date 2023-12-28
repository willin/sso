import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
  const url = new URL(request.url);
  const res = await fetch(`/api/users?${url.searchParams.toString()}`, request);
  const users = await res.json();
  return {
    users
  };
};

export const actions: Actions = {
  forbidden: async ({ fetch, request }) => {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    const res = await fetch(`/api/users/${body.id}/forbidden`, {
      method: 'PUT',
      body: JSON.stringify({
        forbidden: body.type === '1' ? 0 : 1
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  }
};
