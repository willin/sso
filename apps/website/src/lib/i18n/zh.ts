import type { I18nDict } from '@svelte-dev/i18n';

export const dict: I18nDict = {
  __name: '中文',
  __flag: '🇨🇳',
  __unicode: '1f1e8-1f1f3',
  __code: 'ZH',
  __direction: 'ltr',
  __status: '',
  site: {
    title: '你好，世界'
  },
  common: {
    domain: '申请免费二级域名',
    total: '总计别名记录',
    available: '可注册域名后缀',
    login: '申请 / 管理',
    example: '示例',
    refer_to: '指向',
    deploy: '部署你自己的别名服务',
    limit_info: '别名数量限制策略',
    follow: '⭐️ 去关注',
    donate: '⚡ 去充电',
    user: '登录用户',
    follower: 'Github 关注粉丝',
    vip: '打赏月捐 VIP',
    adblock: '发现广告拦截插件',
    adblock_message: '请关闭广告拦截插件以继续使用本站服务。'
  },
  alias: {
    alias: '别名',
    account: '目标账户',
    created_at: '创建时间',
    operation: '操作',
    delete: '删除',
    check: '检查',
    create: '创建',
    save: '保存',
    confirm_delete: '确认要删除该别名吗？',
    no_alias: '还没有别名，快去创建一个吧。'
  }
};
