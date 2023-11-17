import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  site: {
    title: 'Willin SSO'
  },
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
    membership: 'Membership'
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
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm_delete: 'Are you sure to delete?',
    created_at: 'Created Time',
    updated_at: 'Updated Time',
    go_back: 'Go back',
    login: 'Login',
    logout: 'Logout'
  }
};
