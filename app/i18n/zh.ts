import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  site: {
    title: 'Willin SSO'
  },
  user: {
    management: '用户管理',
    user: '用户',
    vip: '赞助者 / VIP',
    admin: '管理员',
    id: '用户 ID',
    username: '用户名',
    display_name: '昵称',
    avatar: '头像',
    type: '类型',
    membership: '有效期',
    normal: '正常用户',
    forbidden: '禁用账户',
    ban: '禁止登录',
    unban: '激活登录',
    thirdparty: '登录方式',
    bind: '绑定',
    unbind: '解绑'
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
    login_with: '使用 {{provider}} 登录',
    confirm: '确定要执行该操作吗？',
    confirm_delete: '确定要删除吗？',
    confirm_logout: '确定要退出登录吗？',
    created_at: '创建时间',
    updated_at: '修改时间',
    go_back: '后退',
    login: '登录',
    logout: '退出'
  }
};
