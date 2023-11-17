import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  site: {
    title: 'Willin SSO'
  },
  app: {
    management: '应用管理',
    id: 'clientId',
    logo: 'Logo',
    name: '应用名称',
    description: '应用介绍',
    secret: 'clientSecret',
    redirect_uris: '回调连接',
    production: '是否发布',
    homepage: '官方主页'
  },
  common: {
    created_at: '创建时间',
    updated_at: '修改时间',
    go_back: '后退',
    login: '登录',
    logout: '退出',
    user: '用户',
    vip: '赞助者 / VIP',
    admin: '管理员'
  }
};
