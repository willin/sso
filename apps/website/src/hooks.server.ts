import { getLocales, locale } from '@svelte-dev/i18n';
import type { Handle } from '@sveltejs/kit';
import { fallbackLng } from '$lib/i18n';
import app from '$lib/hono';

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth')) {
    return await app.fetch(
      event.request,
      event.platform.env,
      event.platform.context
    );
  }
  const [, matched = ''] = url.pathname.split('/');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const lang: string = getLocales().includes(matched) ? matched : fallbackLng;
  locale.set(lang);

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
};
