<script lang="ts">
  import { t } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';
  import { applyAction, enhance } from '$app/forms';
  import { afterNavigate, goto, invalidateAll } from '$app/navigation';
  import Pagination from '$lib/components/Pagination.svelte';

  const baned = $derived($page.url.searchParams.get('forbidden') === '1');

  function handleUserType(e: Event) {
    const t = e.target as HTMLSelectElement;
    const search = new URLSearchParams($page.url.search);
    search.set('forbidden', t.value);
    goto(`${$page.url.pathname}?${search.toString()}`);
  }

  async function handleSubmit() {
    // @ts-ignore
    return async ({ result }) => {
      await applyAction(result);
      if (result?.data?.result === true) {
        await invalidateAll();
      }
    };
  }

  function confirmOperation(e: Event) {
    if (!confirm($t('common.confirm'))) {
      e.preventDefault();
      return false;
    }
  }

  afterNavigate(() => {
    invalidateAll();
  });
</script>

<form action="?/forbidden" method="POST" use:enhance={handleSubmit}>
  <h2 class="my-2">
    {$t('common.total')}： {$page.data.users?.total}
  </h2>

  <div class="overflow-x-auto">
    <table class="table table-zebra w-full min-w-full table-md">
      <thead>
        <tr>
          <th>{$t('user.avatar')}</th>
          <th>{$t('user.username')}</th>
          <th>{$t('user.display_name')}</th>
          <th>{$t('user.type')}</th>
          <th>{$t('common.created_at')}</th>
          <th>
            <select
              name="type"
              on:change={handleUserType}
              value={baned ? '1' : '0'}
              class="select select-bordered">
              <option value="0">{$t('user.normal')}</option>
              <option value="1">{$t('user.forbidden')}</option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each $page.data.users?.data as user (user.id)}
          <tr>
            <td>
              <div class="avatar">
                <div class="w-8 rounded">
                  <img src={user.avatar} alt={user.display_name} />
                </div>
              </div>
            </td>
            <td>{user.username}</td>
            <td>{user.display_name}</td>
            <td>{$t(`user.${user.type}`)}</td>
            <td>{user.created_at}</td>
            <td>
              <button
                type="submit"
                onclick={confirmOperation}
                name="id"
                value={user.id}
                class="text-primary">
                {baned ? $t('user.unban') : $t('user.ban')}
              </button>
              {'  '}
              <a href={`${$linkPrefix}/dashboard/user/edit/${user.id}`}
                >{$t('common.edit')}</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <Pagination total={$page.data.users?.total} />
</form>
