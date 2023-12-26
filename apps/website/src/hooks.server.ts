import { getLocales, locale } from '@svelte-dev/i18n';
import type { Handle } from '@sveltejs/kit';
import { fallbackLng } from '$lib/i18n';

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  const [, matched = ''] = url.pathname.split('/');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const lang: string = getLocales().includes(matched) ? matched : fallbackLng;
  locale.set(lang);

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
};
