import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ request, fetch, params }) => {
  if (!params.id) {
    return {};
  }
  const res = await fetch(`/api/apps/${params.id}`, request);
  const app = await res.json();
  if (!app.id) {
    redirect('307', '/dashboar/app');
  }
  return {
    app
  };
};

export const actions: Actions = {
  save: async ({ request, fetch, params }) => {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    const res = await fetch(`/api/apps${params.id ? `/${params.id}` : ''}`, {
      method: params.id ? 'PUT' : 'POST',
      body: JSON.stringify({
        ...body,
        production: body.production ? 1 : 0
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  },
  secret: async ({ fetch, params }) => {
    const res = await fetch(`/api/apps/${params.id}/secret`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  },
  revoke: async ({ request, fetch, params }) => {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    const res = await fetch(`/api/apps/${params.id}/secret`, {
      method: 'DELETE',
      body: JSON.stringify({
        created_at: body._revoke
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  }
};
