import type { Actions } from './$types';

export const actions: Actions = {
  save: async ({ request, fetch, params }) => {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    const res = await fetch(`/api/users/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  },
  unbind: async ({ request, fetch, params }) => {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    console.log(body);
    const res = await fetch(`/api/users/${params.id}/${body.provider}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
};
