![Logo](https://github.com/willin/sso/assets/1890238/dcfe72fd-72af-40a4-bd14-6e8ee0907f4a)

# @hono-dev/auth-github

For more details: <https://github.com/willin/sso>

## Useage

GitHub provides two types of Apps to utilize its API: the `GitHub App` and the `OAuth App`. To understand the differences between these apps, you can read this [article](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app) from GitHub, helping you determine the type of App you should select.

### Parameters

- `client_id`:
  - Type: `string`.
  - `Required`.
  - `Github App` and `Oauth App`.
  - Your app client ID. You can find this value in the [GitHub App settings](https://github.com/settings/apps) or the [OAuth App settings](https://github.com/settings/developers) based on your App type. <br />When developing **Cloudflare Workers**, there's no need to send this parameter. Just declare it in the `.dev.vars` file as `GITHUB_ID=`.
- `client_secret`:
  - Type: `string`.
  - `Required`.
  - `Github App` and `Oauth App`.
  - Your app client secret. You can find this value in the [GitHub App settings](https://github.com/settings/apps) or the [OAuth App settings](https://github.com/settings/developers) based on your App type. <br />When developing **Cloudflare Workers**, there's no need to send this parameter. Just declare it in the `.dev.vars` file as `GITHUB_SECRET=`.
    > Do not share your client secret to ensure the security of your app.
- `scope`:
  - Type: `string[] | string`.
  - `Optional`.
  - `Oauth App`.
  - Set of **permissions** to request the user's authorization to access your app for retrieving user information and performing actions on their behalf.<br /> Review all the scopes Github offers for utilizing their API on the [Permissions page](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps). <br />For `GitHub Apps`, you select the scopes during the App creation process or in the [settings](https://github.com/settings/apps).
- `oauthApp`:
  - Type: `boolean`.
  - `Optional`.
  - `Oauth App`.
  - Set this value to `true` if your App is of the OAuth App type. Defaults to `false`.
- `redirect_uri`:
  - Type: `string`.
  - `Optional`.
  - `Oauth App`.
  - Github can have multiple callback URLs. Defaults to `c.req.url`.<br />When developing **Cloudflare Workers**, there's no need to send this parameter. Just declare it in the `.dev.vars` file as `GITHUB_CALLBACK_URL=`.

### Authentication Flow

After the completion of the Github Auth flow, essential data has been prepared for use in the subsequent steps that your app needs to take.

`githubAuth` method provides 2 set key data:

- `github-token`:
  - Access token to make requests to the Github API for retrieving user information and performing actions on their behalf.
  - Type:
    ```js
    {
      access_token: string;
      expires_in?: number;  // -> only available for Oauth Apps
      refresh_token?: string;
      refresh_token_expires_in?: number;
      token_type: string;
      scope: GitHubScope[]; // -> Granted Scopes
    }
    ```
- `github-user`:
  - User basic info retrieved from Github
  - Type:
    ```js
    {
      login:  string
      id:  number
      node_id:  string
      avatar_url:  string
      gravatar_id:  string
      url:  string
      html_url:  string
      followers_url:  string
      following_url:  string
      gists_url:  string
      starred_url:  string
      subscriptions_url:  string
      organizations_url:  string
      repos_url:  string
      events_url:  string
      received_events_url:  string
      type:  string
      site_admin:  boolean
      name:  string
      company:  string
      blog:  string
      location:  string
      email:  string  |  null
      hireable:  boolean  |  null
      bio:  string
      twitter_username:  string
      public_repos:  number
      public_gists:  number
      followers:  number
      following:  number
      created_at:  string
      updated_at:  string
      private_gists:  number, // -> Github App
      total_private_repos:  number, // -> Github App
      owned_private_repos:  number, // -> Github App
      disk_usage:  number, // -> Github App
      collaborators:  number, // -> Github App
      two_factor_authentication:  boolean, // -> Github App
      plan: {
        name:  string,
        space:  number,
        collaborators:  number,
        private_repos:  number
      } // -> Github App
    }
    ```

### Github App Example

```ts
import { Hono } from 'hono';
import { githubAuth } from '@hono-dev/auth-github';

const app = new Hono();

app.use(
  '/github',
  githubAuth({
    client_id: Bun.env.GITHUB_ID,
    client_secret: Bun.env.GITHUB_SECRET
  })
);

app.get('/github', (c) => {
  const token = c.get('github-token');
  const user = c.get('github-user');

  return c.json({
    token,
    user
  });
});

export default app;
```

### OAuth App Example

```ts
import { Hono } from 'hono';
import { githubAuth } from '@hono-dev/auth-github';

const app = new Hono();

app.use(
  '/github',
  githubAuth({
    client_id: Bun.env.GITHUB_ID,
    client_secret: Bun.env.GITHUB_SECRET,
    scope: ['public_repo', 'read:user', 'user', 'user:email', 'user:follow'],
    oauthApp: true
  })
);

app.get('/github', (c) => {
  const token = c.get('github-token');
  const user = c.get('github-user');

  return c.json({
    token,
    user
  });
});

export default app;
```

## 赞助 Sponsor

维护者 Owner： [Willin Wang](https://willin.wang)

如果您对本项目感兴趣，可以通过以下方式支持我：

- 关注我的 Github 账号：[@willin](https://github.com/willin) [![github](https://img.shields.io/github/followers/willin.svg?style=social&label=Followers)](https://github.com/willin)
- 参与 [爱发电](https://afdian.net/@willin) 计划
- 支付宝或微信[扫码打赏](https://user-images.githubusercontent.com/1890238/89126156-0f3eeb80-d516-11ea-9046-5a3a5d59b86b.png)

Donation ways:

- Github: <https://github.com/sponsors/willin>
- Paypal: <https://paypal.me/willinwang>
- Alipay or Wechat Pay: [QRCode](https://user-images.githubusercontent.com/1890238/89126156-0f3eeb80-d516-11ea-9046-5a3a5d59b86b.png)

## 许可证 License

Apache-2.0
