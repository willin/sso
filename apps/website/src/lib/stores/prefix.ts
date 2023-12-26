import { locales } from '@svelte-dev/i18n';
import type { Page } from '@sveltejs/kit';
import { derived } from 'svelte/store';
import { page } from '$app/stores';
import { fallbackLng } from '$lib/i18n';

export const linkPrefix = derived(
  [page, locales],
  ([$page, $locales]: [Page, string[]]) => {
    const [, path = ''] = $page.url.pathname.split('/');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lang = $locales.includes(path) ? path : fallbackLng;
    return lang === fallbackLng ? '' : `/${lang}`;
  }
);
