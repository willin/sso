# An Open-Source SSO System

built with Hono.js & SvelteKit

## 开源免费的 IDaaS （SSO 单点登录）服务

Free IDaas And Single Sign-On Service

[![GitHub Repo stars](https://img.shields.io/github/stars/willin/sso?style=social)](https://github.com/willin/sso) [![Fork](https://img.shields.io/github/contributors/willin/sso)](https://github.com/willin/sso/fork)

[中文网站](https://sso.willin.wang) | [English Website](https://sso.willin.wang/en)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [An Open-Source SSO System](#an-open-source-sso-system)
  - [开源免费的 IDaaS （SSO 单点登录）服务](#开源免费的-idaas-sso-单点登录服务)
  - [相关文档 Documentation](#相关文档-documentation)
  - [端点 Endpoints](#端点-endpoints)
  - [开源包 Packages](#开源包-packages)
    - [Packages](#packages)
  - [开发/部署 Development \& Deployment](#开发部署-development--deployment)
    - [部署](#部署)
    - [本地开发](#本地开发)
    - [Deployment](#deployment)
    - [Local Development](#local-development)
  - [赞助 Sponsor](#赞助-sponsor)
  - [许可证 License](#许可证-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 相关文档 Documentation

- 设计文档 Design (In Chinese)： <https://blog.csdn.net/jslygwx/article/details/133765190>
- 开发文档 Dev Guides: TBD
- 部署文档 Deployment Guides: TBD

## 端点 Endpoints

- `/auth/authorize` GET
- `/auth/token` POST
- `/auth/userinfo` GET
- `/auth/revoke` POST
- `/$lang/login` (以下需要登录 below need login)
- `/$lang/dashboard`
- `/api/apps` GET/POST
- `/api/apps/:id` GET/PUT
- `/api/apps/:id/secret` POST/DELETE
- `/api/users` GET
- `/api/users/:id` GET/PUT/POST
- `/api/users/:id/forbidden` PUT/POST
- `/api/users/:id/:provider` DELETE

## 开源包 Packages

### Packages

| Package                                             | Meta                                                                                                                                                                                                                                                                                                                                                                                                                             | Changelog                                           |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [@hono-dev/auth-github](packages/hono-auth-github/) | [![npm](https://img.shields.io/npm/v/@hono-dev/auth-github?style=flat-square&logo=npm)](https://npmjs.org/package/@hono-dev/auth-github) [![npm](https://img.shields.io/npm/dm/@hono-dev/auth-github?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/auth-github) [![npm](https://img.shields.io/npm/dt/@hono-dev/auth-github?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/auth-github) | [Changelog](packages/hono-auth-github/CHANGELOG.md) |
| [@hono-dev/auth-alipay](packages/hono-auth-alipay/) | [![npm](https://img.shields.io/npm/v/@hono-dev/auth-alipay?style=flat-square&logo=npm)](https://npmjs.org/package/@hono-dev/auth-alipay) [![npm](https://img.shields.io/npm/dm/@hono-dev/auth-alipay?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/auth-alipay) [![npm](https://img.shields.io/npm/dt/@hono-dev/auth-alipay?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/auth-alipay) | [Changelog](packages/hono-auth-alipay/CHANGELOG.md) |
| [@hono-dev/auth-afdian](packages/hono-auth-afdian/) | [![npm](https://img.shields.io/npm/v/@hono-dev/auth-afdian?style=flat-square&logo=npm)](https://npmjs.org/package/@hono-dev/auth-afdian) [![npm](https://img.shields.io/npm/dm/@hono-dev/auth-afdian?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/auth-afdian) [![npm](https://img.shields.io/npm/dt/@hono-dev/auth-afdian?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/auth-afdian) | [Changelog](packages/hono-auth-afdian/CHANGELOG.md) |
| [@hono-dev/powered-by](packages/hono-powered-by/)   | [![npm](https://img.shields.io/npm/v/@hono-dev/powered-by?style=flat-square&logo=npm)](https://npmjs.org/package/@hono-dev/powered-by) [![npm](https://img.shields.io/npm/dm/@hono-dev/powered-by?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/powered-by) [![npm](https://img.shields.io/npm/dt/@hono-dev/powered-by?style=flat-square&label=down)](https://npmjs.org/package/@hono-dev/powered-by)       | [Changelog](packages/hono-powered-by/CHANGELOG.md)  |

## 开发/部署 Development & Deployment

### 部署

> [!IMPORTANT]
> 如果需要定制化的开发，比如删除/新增登录方式，则需要具备专业的开发知识，或者联系我进行付费定制。

1. 需要有 Cloudflare 账号、可配置域名和 Github 账号三项前置准备
2. 在 Cloudflare 中创建好 D1 数据库和 KV 缓存桶。
   - 创建 [KV 存储桶](https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces)
   - 创建 [D1 数据库](https://dash.cloudflare.com/?to=/:account/workers/d1)
   - 创建 [API Token](https://dash.cloudflare.com/profile/api-tokens)
3. Fork 本项目，在 Settings 中做后续环境变量配置
4. 设置环境变量，参考 `本地开发`。注意：
   - 创建 [Github OAuth 应用](https://github.com/settings/developers)
   - 创建 [支付宝基础应用](https://open.alipay.com/develop/manage)
   - 爱发电应用需要私信 [@afdian](https://afdian.net/a/afdian)
   - 如果使用 Github 的 Secrets，则不能用 `GITHUB_` 前缀，所以我改成了 `GH_` 前缀，但代码中没有更改，只在 Workflow 中映射
   - 注意：只有 Github 可以不填 CALLBACK_URL（其他登录方式均需要指定域名回调）

### 本地开发

1. 配置开发环境，推荐使用 `bun` 进行开发
2. 创建 `apps/website/.dev.vars` 将 `AFDIAN_CLIENT_ID`、`AFDIAN_CLIENT_SECRET` 等环境变量进行配置。
3. 安装依赖 `bun install && bun run build`

```bash
AFDIAN_CLIENT_ID=
AFDIAN_CLIENT_SECRET=
AFDIAN_CALLBACK_URL=
GITHUB_ID=
GITHUB_SECRET=
GITHUB__CALLBACK_URL=optional
ALIPAY_APP_ID=
ALIPAY_CALLBACK_URL=
ALIPAY_PRIVATE_KEY=
SESSION_KEY=optional
SESSION_SECRET=
```

4. 在 `apps/website`目录下初始化数据库： `npx wrangler d1 migrations apply sso --local`
5. 启动 `bun run dev`
6. 手动修改 `apps/website/.wrangler/state/v3/d1/miniflare-D1DatabaseObject` 下的数据库，通过 SQLite 软件，将你的第一个用户类型 `type` 改为 `admin`

### Deployment

> [!IMPORTANT]
> If you need customized development, such as deleting/adding login methods, you need to have professional development knowledge, or contact me for paid customization.

1. You need to have a Cloudflare account, a configurable domain, and a Github account as prerequisites.
2. Create a D1 database and KV bucket in Cloudflare.
   - Create [KV bucket](https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces)
   - Create [D1 database](https://dash.cloudflare.com/?to=/:account/workers/d1)
   - Create [API Token](https://dash.cloudflare.com/profile/api-tokens)
3. Fork this project and do subsequent environment variable configuration in Settings.
4. Set environment variables, refer to `Local Development`. Note:
   - Create [Github OAuth App](https://github.com/settings/developers)
   - Create [Alipay Basic App](https://open.alipay.com/develop/manage)
   - For Afdian application, you need to send a private message to [@afdian](https://afdian.net/a/afdian)
   - If you use Github's Secrets, you can't use the `GITHUB_` prefix, so I changed it to the `GH_` prefix, but the code has not been changed, only mapped in the Workflow
   - Note: Only Github can leave CALLBACK_URL blank (other login methods need to specify the domain callback)

### Local Development

1. Configure the development environment, it is recommended to use `bun` for development.
2. Create `apps/website/.dev.vars` and configure environment variables such as `AFDIAN_CLIENT_ID`, `AFDIAN_CLIENT_SECRET`.
3. Install dependencies `bun install && bun bun build`

```bash
AFDIAN_CLIENT_ID=
AFDIAN_CLIENT_SECRET=
AFDIAN_CALLBACK_URL=
GITHUB_ID=
GITHUB_SECRET=
GITHUB__CALLBACK_URL=optional
ALIPAY_APP_ID=
ALIPAY_CALLBACK_URL=
ALIPAY_PRIVATE_KEY=
SESSION_KEY=optional
SESSION_SECRET=
```

4. Cd to `apps/website` and init database with: `npx wrangler d1 migrations apply sso --local`
5. Start with `bun run dev`
6. Manually modify the database under `apps/website/.wrangler/state/v3/d1/miniflare-D1DatabaseObject` using SQLite software, change your first user type `type` to `admin`

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
