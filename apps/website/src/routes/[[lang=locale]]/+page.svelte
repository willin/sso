<script>
  import { getPossibleLocales, locales, locale } from '@svelte-dev/i18n';
  import { fallbackLng } from '$lib/i18n';
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import { goto } from '$app/navigation';
  import { loading, user } from '$lib/stores/user';

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

  loading.subscribe((v) => {
    if (v) return;
    if ($user?.id) {
      goto(`${$locale === fallbackLng ? '' : `/${locale}`}/dashboard`);
    } else {
      goto(`${$locale === fallbackLng ? '' : `/${locale}`}/login`);
    }
  });
</script>

<SEO />

<div class="flex justify-center flex-col items-center">
  {#if $loading}
    <div class="loader text-primary my-10"></div>
  {/if}
</div>
