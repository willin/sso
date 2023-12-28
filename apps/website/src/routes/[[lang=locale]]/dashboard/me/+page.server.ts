import type { Actions } from './$types';

export const actions: Actions = {
  save: async ({ request, fetch }) => {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    const { id, ...rest } = body;
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rest),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  },
  unbind: async ({ request, fetch }) => {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    const res = await fetch(`/api/users/${body.id}/${body.provider}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  }
};
