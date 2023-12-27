<script lang="ts">
  import type { App } from '$lib/types';
  import { t } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import AdSlot from '$lib/components/AdSlot.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { linkPrefix } from '$lib/stores/prefix';

  function confirmLogout(e: Event) {
    if (!confirm($t('common.confirm_logout'))) {
      e.preventDefault();
      return false;
    }
  }

  function appLogin(app: App) {
    const search = new URLSearchParams();
    search.append('client_id', app.id);
    search.append('redirect_uri', app.redirect_uris[0]);
    search.append('state', Date.now().toString());
    window.open(`/authorize?${search.toString()}`);
  }
</script>

<SEO />

<div>
  <a href={`${$linkPrefix}/dashboard/me`}>{$page.data.user.username}</a>
  {#if $page.data.user.type === 'admin'}
    <a href={`${$linkPrefix}/dashboard/app`} class="my-2 mx-2">
      {$t('app.management')}
    </a>
    <a href={`${$linkPrefix}/dashboard/user`} class="my-2 mx-2">
      {$t('user.management')}
    </a>
  {/if}
  <a href="/auth/logout" class="btn mx-2" on:click={confirmLogout}>
    {$t('common.logout')}
  </a>
</div>

<div>
  {#each $page.data.apps as app (app.id)}
    <div class="card card-side w-full my-4 bg-base-100 shadow-xl">
      <figure>
        <img
          src={app.logo.startsWith('http') ? app.logo : '/images/logo.jpg'}
          alt={app.name}
          class="ml-4 w-32 rounded" />
      </figure>

      <div class="card-body">
        <h2 class="card-title">{app.name}</h2>
        <p>{app.description}</p>
        <p>
          {$t('app.homepage')}： {app.homepage}
        </p>
        <div class="card-actions justify-end">
          <button onClick={() => appLogin(app)} class="btn btn-primary">
            {$t('common.login')}
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
<AdSlot />
