<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';

  const { total } = $props();

  let size = $state('20');
  const pages = $derived(Math.ceil(Number(total || 0) / Number(size)));
  const search = $derived($page.url.searchParams);

  const arr = $derived(
    Array.from(
      { length: 5 },
      (_, i) => Number(search.get('page')) - 2 + i
    ).filter((x) => x > 1 && x < pages)
  );

  $effect(() => {
    if (!search.get('size') || !search.get('page')) {
      search.set('size', '20');
      search.set('page', '1');
      goto(`${$page.url.pathname}?${search.toString()}`);
    }
  });
  function handleLink(e: Event) {
    goto((e.target as HTMLAnchorElement).href);
  }
  function handleSize(e: Event) {
    search.set('size', (e.target as HTMLSelectElement).value);
    goto(`${$page.url.pathname}?${search.toString()}`);
  }
</script>

<div class="flex justify-center my-4">
  <select
    on:change={handleSize}
    class="select select-bordered w-24 max-w-xs mr-2"
    bind:value={size}>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select>
  <div class="join">
    <a
      on:click|preventDefault={handleLink}
      class="join-item btn"
      class:btn-disabled={search.get('page') === '1'}
      href={`${$linkPrefix}${$page.url.pathname}?${search
        .toString()
        .replace(`page=${search.get('page')}`, `page=1`)}`}>
      1
    </a>
    {#if arr.length > 0 && arr[0] > 2}
      <button class="join-item btn btn-disabled">...</button>
    {/if}
    {#each arr as p (p)}
      <a
        on:click|preventDefault={handleLink}
        class="join-item btn"
        class:btn-disabled={search.get('page') === `${p}`}
        href={`${$linkPrefix}${$page.url.pathname}?${search
          .toString()
          .replace(`page=${search.get('page')}`, `page=${p}`)}`}>
        {p}
      </a>
    {/each}
    {#if arr.length > 0 && arr[arr.length - 1] < pages - 1}
      <button class="join-item btn btn-disabled">...</button>
    {/if}
    {#if pages > 1}
      <a
        on:click|preventDefault={handleLink}
        class="join-item btn"
        class:btn-disabled={search.get('page') === `${pages}`}
        href={`${$linkPrefix}${$page.url.pathname}?${search
          .toString()
          .replace(`page=${search.get('page')}`, `page=${pages}`)}`}>
        {pages}
      </a>
    {/if}
  </div>
</div>
