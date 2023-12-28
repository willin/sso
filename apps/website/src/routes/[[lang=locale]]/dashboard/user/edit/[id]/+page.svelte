<script lang="ts">
  import { t } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import { applyAction, enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import { linkPrefix } from '$lib/stores/prefix';
  import { getProviderName } from '$lib/utils';

  let loading = $state(false);

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

  function confirmOperation(e: Event) {
    if (!confirm($t('common.confirm'))) {
      e.preventDefault();
      return false;
    }
  }
</script>

<form action="?/save" method="POST" use:enhance={handleSubmit}>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('user.id')}</span>
    </label>
    <input
      type="text"
      placeholder={$t('user.id')}
      value={$page.data.user?.id || ''}
      class="input input-bordered w-full input-disabled"
      readOnly />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('user.username')}</span>
    </label>
    <input
      type="text"
      name="username"
      placeholder={$t('user.username')}
      value={$page.data.user?.username || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('user.display_name')}</span>
    </label>
    <input
      type="text"
      name="display_name"
      placeholder={$t('user.display_name')}
      value={$page.data.user?.display_name || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">{$t('user.avatar')}</span>
    </label>
    <input
      type="text"
      name="avatar"
      placeholder={$t('user.avatar')}
      value={$page.data.user?.avatar || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full py-4 my-2">
    <button
      type="submit"
      class="btn btn-primary"
      disabled={loading}
      class:btn-disabled={loading}>
      {$t('common.save')}
    </button>
  </div>
</form>
<h3 class="my-4">{$t('user.thirdparty')}</h3>
{#snippet ThirdPartyCard(thirdUser)}
	<div class='card w-full my-4 bg-base-100 shadow-xl'>
    <div class='card-body'>
      <h2 class='card-title capitalize'>{getProviderName(thirdUser.provider)}</h2>
      <p>{$t('common.created_at')}: {thirdUser.created_at}</p>
      <div class='card-actions justify-end'>
        <form action="?/unbind" method="POST" use:enhance={handleSubmit}>
          <div class='form-control w-full my-2'>
            <button type='submit' name='provider' value={thirdUser.provider} class='btn btn-primary'
            onclick={confirmOperation}
            disabled={loading ||$page.data.user?.thirdparty?.length === 1}
            class:btn-disabled={loading ||$page.data.user?.thirdparty?.length === 1}
            >
              {$t('user.unbind')}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/snippet}

{#each $page.data.user?.thirdparty as thirdUser(thirdUser.id)}
  {@render ThirdPartyCard(thirdUser)}
{/each}
