import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
  const res = await fetch('/api/apps', request);
  const apps = await res.json();
  return {
    apps: apps.filter((app) => !!app.production)
  };
};
