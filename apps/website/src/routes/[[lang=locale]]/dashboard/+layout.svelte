<script>
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';
  import { t } from '@svelte-dev/i18n';
</script>

{#if !$page.url.pathname.endsWith('/dashboard')}
  <div class="tooltip mr-4" data-tip={$t('common.go_back')}>
    <a href={`${$linkPrefix}/dashboard`} class="btn btn-circle">
      <svg
        viewBox="0 0 512 512"
        class="fill-current"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="48"
          d="M244 400L100 256l144-144M120 256h292" />
      </svg>
    </a>
  </div>
{/if}

<slot />
