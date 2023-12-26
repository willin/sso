<script lang="ts">
  import { themes } from '$lib/themes';
  import { themeChange } from 'theme-change';

  $effect(() => {
    themeChange(false);
  });
</script>

<div class="dropdown dropdown-end">
  <div tabindex="0" class="btn gap-1 normal-case btn-ghost">
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="inline-block h-5 w-5 stroke-current md:h-6 md:w-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
    <svg
      width="12px"
      height="12px"
      class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048">
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
    </svg>
  </div>
  <div
    tabindex="0"
    class="dropdown-content bg-neutral text-neutral-content rounded-t-box rounded-b-box top-px mt-14 w-60 h-[70vh] overflow-y-auto shadow-2xl">
    <div class="grid grid-cols-1 gap-3 p-3">
      {#each themes as theme (theme.id)}
        <button
          class="outline-neutral-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline"
          data-set-theme={theme.id}
          data-act-class="[&_svg]:visible">
          <div
            data-theme={theme.id}
            class="bg-neutral text-neutral-content w-full cursor-pointer font-sans">
            <div class="grid grid-cols-5 grid-rows-3">
              <div
                class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="invisible h-3 w-3 shrink-0 mt-1">
                  <path
                    d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                </svg>
                <div class="flex-grow text-sm font-bold">{theme.name}</div>
                <div class="flex flex-shrink-0 flex-wrap gap-1">
                  <div class="bg-primary w-2 rounded" />
                  <div class="bg-secondary w-2 rounded" />
                  <div class="bg-accent w-2 rounded" />
                  <div class="bg-neutral w-2 rounded" />
                </div>
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
