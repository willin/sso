<script>
  import '../app.css';
  // import { t } from '@svelte-dev/i18n';
  import SEO from '$lib/components/SEO.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { onNavigate } from '$app/navigation';
  import Bootstrap from '$lib/components/Bootstrap.svelte';

  onNavigate((navigation) => {
    // @ts-ignore
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      // @ts-ignore
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<SEO />

<div id="background"></div>
<Navbar />

<main
  class="w-[960px] max-w-full mx-auto shadow bg-neutral/90 text-neutral-content p-2 sm:p-4 mb-20">
  <article class='prose'>
    <slot />
  </article>

  <Bootstrap />
</main>

<footer class="text-center text-sm mt-4">
  <p>
    <a
      href="https://github.com/willin"
      target="_blank"
      class="inline-block"
      rel="noreferrer">
      <img
        src="https://img.shields.io/github/followers/willin.svg?style=social&amp;label=Followers"
        alt="Github Followers" />
    </a>{' '}
    <a
      href="https://github.com/willin/sso"
      target="_blank"
      class="inline-block"
      rel="noreferrer">
      <img
        alt="GitHub Repo stars"
        src="https://img.shields.io/github/stars/willin/sso?style=social" />
    </a>
  </p>
  <p>
    &copy;{' '}
    <a href="https://willin.wang" target="_blank" rel="noreferrer">
      Willin Wang
    </a>
  </p>
</footer>
