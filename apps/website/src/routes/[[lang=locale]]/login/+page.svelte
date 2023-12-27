<script>
  import SEO from '$lib/components/SEO.svelte';
  import { t, locale } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fallbackLng } from '$lib/i18n';

  const user = $derived($page.data.user);
  $effect(() => {
    if (user) {
      goto(`${$locale === fallbackLng ? '' : `/${$locale}`}/dashboard`);
    }
  });
</script>

<SEO />

{#if !user}
  <a href="/auth/github" class="btn btn-primary w-full my-2">
    {$t('common.login_with', { provider: 'GitHub' })}
  </a>
  <a href="/auth/github" class="btn btn-secondary w-full my-2">
    {$t('common.login_with', { provider: '爱发电(afdian.net)' })}
  </a>
  <a href="/auth/alipay" class="btn btn-accent w-full my-2">
    {$t('common.login_with', { provider: '支付宝(alipay.com)' })}
  </a>
{/if}
