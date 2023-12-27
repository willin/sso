<script>
  import { getPossibleLocales, locales, locale } from '@svelte-dev/i18n';
  import { fallbackLng } from '$lib/i18n';
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import { goto } from '$app/navigation';

  $effect(() => {
    const isInit = !!localStorage.getItem('lang');
    if (isInit) return;
    const langs = getPossibleLocales(navigator.language);
    langs.forEach((lang) => {
      if ($locales.includes(lang)) {
        localStorage.setItem('lang', lang);
        if (lang !== fallbackLng && $page.url.pathname === '/') {
          goto('/' + lang);
        }
      }
    });
  });

  $effect(() => {
    if (!$page.data.user) {
      goto(`${$locale === fallbackLng ? '' : `/${$locale}`}/login`);
    } else {
      goto(`${$locale === fallbackLng ? '' : `/${$locale}`}/dashboard`);
    }
  });
</script>

<SEO />

<div class="flex justify-center flex-col items-center">
  <div class="loader text-primary my-10"></div>
</div>
