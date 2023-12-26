<script lang="ts">
  let siteData = {
    title: 'Willin SSO 单点登录系统',
    desc: "A Willin Wang's Work"
  };
  const {
    formatTitle = true,
    title = '',
    desc = siteData.desc
  } = $props<{ formatTitle?: boolean; title?: string; desc?: string }>();
  const formattedTitle = $derived(
    formatTitle ? (title ? `${title} — ${siteData.title}` : `${siteData.title}`) : title
  );
</script>

<svelte:head>
  <title>{formattedTitle}</title>
  <meta name="description" content={desc} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={formattedTitle} />
  <meta name="twitter:description" content={desc} />
  <meta property="og:title" content={formattedTitle} />
  <meta property="og:description" content={desc} />
</svelte:head>
