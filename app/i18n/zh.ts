import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  site: {
    title: 'Willin SSO'
  },
  app: {
    management: '应用管理',
    create: '创建应用',
    edit: '编辑应用',
    create_secret: '创建 Client Secret',
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
    save: '保存',
    edit: '编辑',
    delete: '删除',
    confirm_delete: '确定要删除吗？',
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
