<script lang="ts">
  import { t } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import { applyAction, enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import { linkPrefix } from '$lib/stores/prefix';

  let loading = $state(false);

  function confirmDelete(e: Event) {
    if (!confirm($t('common.confirm_delete'))) {
      e.preventDefault();
      return false;
    }
  }

  async function handleSubmit() {
    loading = true;

    // @ts-ignore
    return async ({ result }) => {
      await applyAction(result);
      if (!$page.params.id && result?.data?.id) {
        goto(`${$linkPrefix}/dashboard/app/edit/${result?.data?.id}`);
      }
      if (result?.data?.result === true) {
        await invalidateAll();
      }
      loading = false;
    };
  }
</script>

<h2 class="text-primary text-2xl my-2">
  {$t($page.params.id ? 'app.edit' : 'app.create')}
</h2>

{#if $page.form?.created}
  <div class="alert">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-info shrink-0 w-6 h-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>{$page.form?.created}</span>
  </div>
{/if}

<form action="?/save" method="POST" use:enhance={handleSubmit}>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('app.name')}</span>
    </label>
    <input
      type="text"
      name="name"
      placeholder={$t('app.name')}
      required
      value={$page.data.app?.name || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('app.description')}</span>
    </label>
    <textarea
      name="description"
      placeholder={$t('app.description')}
      value={$page.data.app?.description || ''}
      class="textarea textarea-bordered h-24 w-full"></textarea>
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('app.redirect_uris')}</span>
    </label>
    <input
      type="text"
      name="redirect_uris"
      required
      placeholder={$t('app.redirect_uris')}
      value={Array.isArray($page.data.app?.redirect_uris)
        ? $page.data.app?.redirect_uris.join(',')
        : $page.data.app?.redirect_uris || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('app.logo')}</span>
    </label>
    <input
      type="text"
      name="logo"
      placeholder={$t('app.logo')}
      value={$page.data.app?.logo || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('app.homepage')}</span>
    </label>
    <input
      type="text"
      name="homepage"
      placeholder={$t('app.homepage')}
      value={$page.data.app?.homepage || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label cursor-pointer">
      <span class="label-text">{$t('app.production')}</span>
      <input
        type="checkbox"
        class="toggle"
        name="production"
        checked={$page.data.app?.production || false} />
    </label>
  </div>
  <div class="form-control w-full my-2">
    <button
      type="submit"
      disabled={loading}
      class="btn btn-primary"
      class:btn-disabled={loading}>
      {$t('common.save')}
    </button>
  </div>

  {#if $page.params.id}
    <div class="form-control w-full my-2">
      <label class="label">
        <span class="label-text">{$t('app.id')}</span>
      </label>
      <input
        type="text"
        placeholder={$t('app.id')}
        value={$page.data.app?.id || ''}
        class="input input-bordered w-full"
        disabled />
    </div>
    <h3>{$t('app.secret')}</h3>
    <div class="form-control w-full my-2">
      <ul>
        {#each $page.data.app?.secret as s (s)}
          <li>
            <div class="alert">
              <span>
                {$t('common.created_at')}: {s.created_at}
              </span>
              <div>
                <button
                  onclick={confirmDelete}
                  formaction="?/revoke"
                  name="_revoke"
                  value={s.created_at}
                  disabled={loading}
                  class="btn btn-sm btn-warning"
                  class:btn-disabled={loading}>
                  {$t('common.delete')}
                </button>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <div class="form-control w-full my-2">
      <button
        formaction="?/secret"
        disabled={loading}
        class="btn btn-secondary"
        class:btn-disabled={loading}>
        {$t('app.create_secret')}
      </button>
    </div>
  {/if}
</form>
