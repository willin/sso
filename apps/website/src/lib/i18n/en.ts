import type { I18nDict } from '@svelte-dev/i18n';

export const dict: I18nDict = {
  __name: 'English',
  __flag: '🇺🇸',
  __unicode: '1f1fa-1f1f8',
  __code: 'EN',
  __direction: 'ltr',
  __status: 'beta',
  site: {
    title: 'Hello World'
  },
  common: {
    domain: 'Apply for free sub domains',
    total: 'Total Aliases Registered',
    available: 'Available Domains',
    login: 'Apply / Manage',
    example: 'Example',
    refer_to: 'Refer to',
    deploy: 'Deploy your own alias service',
    limit_info: 'Alias Count Limit Policy',
    follow: '⭐️ Go & Follow',
    donate: '⚡ Sponsor Willin',
    user: 'User',
    follower: 'Github Follower',
    vip: 'Sponsor / VIP',
    adblock: 'Adblock Detected',
    adblock_message: 'Please disable adblock to continue using this site.'
  },
  alias: {
    alias: 'Alias',
    account: 'Target Account',
    created_at: 'Create Time',
    operation: 'Operation',
    delete: 'Delete',
    check: 'Check',
    create: 'Create',
    save: 'Save',
    confirm_delete: 'Are you sure to delete this alias?',
    no_alias: 'No alias yet, please create one first.'
  }
};
