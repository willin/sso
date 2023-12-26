import type { I18nDict } from '@svelte-dev/i18n';

export const dict: I18nDict = {
  __name: 'English',
  __flag: '🇺🇸',
  __unicode: '1f1fa-1f1f8',
  __code: 'EN',
  __direction: 'ltr',
  __status: 'beta',
  user: {
    management: 'User Management',
    user: 'User',
    vip: 'Sponsor / VIP',
    admin: 'Admin',
    id: 'User ID',
    username: 'Username',
    display_name: 'Display Name',
    avatar: 'Avatar',
    type: 'User Type',
    membership: 'Membership',
    normal: 'Normal Users',
    forbidden: 'Forbidden Users',
    ban: 'Ban',
    unban: 'Active',
    thirdparty: 'Third Party Login',
    bind: 'Bind',
    unbind: 'Unbind'
  },
  app: {
    management: 'App Management',
    create: 'Create App',
    edit: 'Edit App',
    create_secret: 'Create Client Secret',
    id: 'clientId',
    logo: 'Logo',
    name: 'App Name',
    description: 'Description',
    secret: 'clientSecret',
    redirect_uris: 'redirectUris',
    production: 'Is Production',
    homepage: 'Homepage'
  },
  common: {
    total: 'Total',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    login_with: 'Login with {{provider}}',
    confirm: 'Are you sure?',
    confirm_delete: 'Are you sure to delete?',
    confirm_logout: 'Are you sure to logout?',
    vip: 'Upgrade/Renew VIP',
    profile: 'Profile',
    created_at: 'Created Time',
    updated_at: 'Updated Time',
    go_back: 'Go back',
    login: 'Login',
    logout: 'Logout',
    adblock: 'Adblock Detected',
    adblock_message: 'Please disable adblock to continue using this site.'
  }
};
