<script lang="ts">
  import { t } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';
</script>

<div>
  <div class="overflow-x-auto my-4 bg-neutral text-neutral-content">
    <table class="table w-full min-w-full table-pin-cols">
      <thead>
        <tr>
          <th>{$t('app.logo')}</th>
          <th>{$t('app.name')}</th>
          <th>{$t('app.production')}</th>
          <th>{$t('app.homepage')}</th>
          <th>{$t('common.created_at')}</th>
          <th>
            <a
              href={`${$linkPrefix}/dashboard/app/edit`}
              class="btn btn-sm btn-circle">
              +
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each $page.data.apps as app (app.id)}
          <tr>
            <td>
              <div class="avatar">
                <div class="w-8 rounded">
                  <img
                    src={app.logo.startsWith('http') ? app.logo : '/logo.jpg'}
                    alt={app.name} />
                </div>
              </div>
            </td>
            <td>{app.name}</td>
            <td>
              <input
                type="checkbox"
                checked={app.production}
                class="checkbox checkbox-primary"
                disabled />
            </td>
            <td>
              <a href={app.homepage} target="_blank" rel="noreferrer">
                {app.homepage}
              </a>
            </td>
            <td>{app.created_at}</td>
            <th>
              <a
                class="text-primary"
                href={`${$linkPrefix}/dashboard/app/edit/${app.id}`}>
                {$t('common.edit')}
              </a>
            </th>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
