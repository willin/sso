<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '@svelte-dev/i18n';

  let blocked = $state(false);
  const user = $derived($page.data.user);
  let hideAd = $derived(
    user && (user?.type === 'admin' || user?.type === 'vip')
  );

  const SCRIPT =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5059418763237956';

  $effect.root(() => {
    // Ignore core pages
    if (
      hideAd ||
      ['/', '/zh', '/en'].includes($page.url.pathname) ||
      window.location.hostname === 'localhost'
    )
      return;

    // (A) TEST FETCH HEADER REQUEST TO GOOGLE ADSENSE
    const test = new Request(SCRIPT, { method: 'HEAD', mode: 'no-cors' });
    // (B) FIRE THE REQEST
    let result: boolean;
    fetch(test)
      .then(() => (result = true))
      .catch(() => (result = false))
      .finally(() => {
        const elm = document.querySelector('ins.adsbygoogle');
        if (
          !result ||
          // @ts-ignore
          (elm && window.getComputedStyle(elm).display === 'none') ||
          (elm &&
            // @ts-ignore
            window.getComputedStyle(elm.parentElement).display === 'none')
        ) {
          // 删除文章正文
          const sponsor = document.querySelector('article.prose');
          sponsor?.remove();
          blocked = true;
        } else {
          blocked = false;
        }
      });
  });
</script>

{#if blocked}
  <article>
    <h1>{$t('common.adblock')}</h1>
    <p>{$t('common.adblock_message')}</p>
  </article>
{/if}

{#if !hideAd}
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5059418763237956"
    crossorigin="anonymous"></script>
{/if}
