# An Open-Source SSO System

built with Hono.js & SvelteKit

## 开源免费的 IDaaS （SSO 单点登录）服务

Free IDaas And Single Sign-On Service

[![GitHub Repo stars](https://img.shields.io/github/stars/willin/sso?style=social)](https://github.com/willin/sso) [![Fork](https://img.shields.io/github/contributors/willin/sso)](https://github.com/willin/sso/fork)

[中文网站](https://sso.willin.wang) | [English Website](https://sso.willin.wang/en)

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

## 开发/部署 Development & Deployment

### 部署

> [!IMPORTANT]
> 如果需要定制化的开发，比如删除/新增登录方式，则需要具备专业的开发知识，或者联系我进行付费定制。

1. 需要有 Cloudflare 账号、可配置域名和 Github 账号三项前置准备
2. 在 Cloudflare 中创建好 D1 数据库和 KV 缓存桶。可以修改项目 `apps` 目录中两个应用的 `wrangler.toml` 配置
   - 创建 [KV 存储桶](https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces)
   - 创建 [D1 数据库](https://dash.cloudflare.com/?to=/:account/workers/d1)
   - 创建 [API Token](https://dash.cloudflare.com/profile/api-tokens)
3. Fork 本项目，在 Settings 中做后续环境变量配置
4. 设置环境变量，参考 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)。注意：
   - 创建 [Github OAuth 应用](https://github.com/settings/developers)
   - 创建 [支付宝基础应用](https://open.alipay.com/develop/manage)
   - 爱发电应用需要私信 [@afdian](https://afdian.net/a/afdian)
   - 如果使用 Github 的 Secrets，则不能用 `GITHUB_` 前缀，所以我改成了 `GH_` 前缀，但代码中没有更改，只在 Workflow 中映射
   - 注意：只有 Github 可以不填 CALLBACK_URL（其他登录方式均需要指定域名回调）

### 本地开发

1. 配置开发环境，推荐使用 `bun` 进行开发
2. 创建 `apps/sso/.dev.vars` 将 `AFDIAN_CLIENT_ID`、`AFDIAN_CLIENT_SECRET` 等环境变量进行配置。
   ```bash
   AFDIAN_CLIENT_ID=
   AFDIAN_CLIENT_SECRET=
   AFDIAN_CALLBACK_URL=
   GITHUB_ID=
   GITHUB_SECRET=
   ALIPAY_APP_ID=
   ALIPAY_CALLBACK_URL=
   ALIPAY_PRIVATE_KEY=
   ```
3. 安装依赖 `bun install`
4. 启动 `bun run dev`。或者分别启动 SSO 和 Web 服务 `bun run dev --filter v0-sso`、`bun run dev --filter web`
5. 手动修改 `apps/sso/.wrangler/state/v3/d1/miniflare-D1DatabaseObject` 下的数据库，通过 SQLite 软件，将你的第一个用户类型 `type` 改为 `admin`

### Deployment

> [!IMPORTANT]
> If you need customized development, such as deleting/adding login methods, you need to have professional development knowledge, or contact me for paid customization.

1. You need to have a Cloudflare account, a configurable domain, and a Github account as prerequisites.
2. Create a D1 database and KV bucket in Cloudflare. You can modify the `wrangler.toml` configuration of the two applications in the `apps` directory.
   - Create [KV bucket](https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces)
   - Create [D1 database](https://dash.cloudflare.com/?to=/:account/workers/d1)
   - Create [API Token](https://dash.cloudflare.com/profile/api-tokens)
3. Fork this project and do subsequent environment variable configuration in Settings.
4. Set environment variables, refer to [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Note:
   - Create [Github OAuth App](https://github.com/settings/developers)
   - Create [Alipay Basic App](https://open.alipay.com/develop/manage)
   - For Afdian application, you need to send a private message to [@afdian](https://afdian.net/a/afdian)
   - If you use Github's Secrets, you can't use the `GITHUB_` prefix, so I changed it to the `GH_` prefix, but the code has not been changed, only mapped in the Workflow
   - Note: Only Github can leave CALLBACK_URL blank (other login methods need to specify the domain callback)

### Local Development

1. Configure the development environment, it is recommended to use `bun` for development.
2. Create `apps/sso/.dev.vars` and configure environment variables such as `AFDIAN_CLIENT_ID`, `AFDIAN_CLIENT_SECRET`.
3. Install dependencies `bun install`

```bash
 AFDIAN_CLIENT_ID=
 AFDIAN_CLIENT_SECRET=
 AFDIAN_CALLBACK_URL=
 GITHUB_ID=
 GITHUB_SECRET=
 ALIPAY_APP_ID=
 ALIPAY_CALLBACK_URL=
 ALIPAY_PRIVATE_KEY=
```

4. Start with `bun run dev`. Or start SSO and Web services separately with `bun run dev --filter v0-sso`, `bun run dev --filter web`
5. Manually modify the database under `apps/sso/.wrangler/state/v3/d1/miniflare-D1DatabaseObject` using SQLite software, change your first user type `type` to `admin`

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
