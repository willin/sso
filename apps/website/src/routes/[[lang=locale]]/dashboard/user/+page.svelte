<script lang="ts">
  import { t } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';
</script>

<form action="?/ban">
  <h2 class="my-2">
    {$t('common.total')}： ##total
  </h2>
  <table class="table table-zebra w-full min-w-full table-md">
    <thead>
      <tr>
        <th>{$t('user.avatar')}</th>
        <th>{$t('user.username')}</th>
        <th>{$t('user.display_name')}</th>
        <th>{$t('user.type')}</th>
        <th>{$t('common.created_at')}</th>
        <th>
          <select class="select select-bordered">
            <option value="0">{$t('user.normal')}</option>
            <option value="1">{$t('user.forbidden')}</option>
          </select>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- <tr key={user.id}>
        <td>
          <div class='avatar'>
            <div class='w-8 rounded'>
              <img src={user.avatar} alt={user.displayName} />
            </div>
          </div>
        </td>
        <td>{user.username}</td>
        <td>{user.displayName}</td>
        <td>{$t(`user.${user.type}`)}</td>
        <td>{dayjs(user.createdAt).format('YYYY-MM-DD')}</td>
        <td>
          <button type='submit' onClick={confirmOperation} name='id' value={user.id} class='text-primary'>
            {searchParams.get('forbidden') === '1' ? t('user.unban') : t('user.ban')}
          </button>
          {'  '}
          <LocaleLink to={`/dashboard/user/edit/${user.id}`}>{$t('common.edit')}</LocaleLink>
        </td>
      </tr> -->
    </tbody>
  </table>
  <!-- <Paginator total={$total} /> -->
</form>
