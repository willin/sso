import styles from './tailwind.css';
import type { LinksFunction } from '@remix-run/cloudflare';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/ico' },
  { rel: 'icon', href: '/favicon.png', type: 'image/png' }
];

export const meta: MetaFunction = () => {
  return [
    { title: 'SSO - Willin Wang' },
    { name: 'description', content: 'Source: https://github.com/willin/sso' },
    {
      name: 'keywords',
      content: ['Remix', 'IDaaS', 'SSO', 'OIDC', 'OAuth', 'React', 'JavaScript', 'Willin Wang'].join(', ')
    },
    { name: 'author', content: 'Willin Wang' }
  ];
};

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
