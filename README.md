# 开源免费的 IDaaS （SSO 单点登录）服务

## Free IDaas And Single Sign-On Service

[![GitHub Repo stars](https://img.shields.io/github/stars/willin/sso?style=social)](https://github.com/willin/sso) [![Fork](https://img.shields.io/github/contributors/willin/sso)](https://github.com/willin/sso/fork)

<https://sso.willin.wang/>

## 相关文档 Documentation

- 设计文档 Design (In Chinese)： <https://blog.csdn.net/jslygwx/article/details/133765190>
- 开发文档 Dev Guides: TBD
- 部署文档 Deployment Guides: TBD

## 端点 Endpoints

- `/authorize`
- `/token`
- `/userinfo`
- `/$lang/login`
- `/$lang/dashboard` (需要登录 need login)

## 赞助 Sponsor

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

---

## 开发 Development

```bash
# init db
npx wrangler d1 migrations apply DB --local

# optional import data
npx wrangler d1 execute DB --file /PATH/data.sql --local
```
