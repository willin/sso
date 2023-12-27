<script>
  import { locale, t } from '@svelte-dev/i18n';
  import { goto } from '$app/navigation';
  import { fallbackLng } from '$lib/i18n';
  import { loading, user } from '$lib/stores/user';

  loading.subscribe((v) => {
    if (v) return;
    if (!$user?.id) {
      goto(`${$locale === fallbackLng ? '' : `/${locale}`}/login`);
    }
  });
</script>

{#if $loading}
  <div class="flex justify-center flex-col items-center">
    <div class="loader text-primary my-10"></div>
  </div>
{:else}
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
