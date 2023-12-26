import { addMessages, locale, type I18nDict } from '@svelte-dev/i18n';
import { browser } from '$app/environment';
import { navigating } from '$app/stores';

const translations = import.meta.glob('./i18n/*.ts', { eager: true });

export const supportedLanguages = [];
export const fallbackLng = 'zh';

Object.entries(translations).forEach(([name, mod]: [string, I18nDict]) => {
  const lang = name.replace(/.+\/(.+)\.ts/, '$1');
  addMessages(lang, mod.dict);
  supportedLanguages.push(lang);
});

if (browser) {
  const path = new URL(location?.href).pathname.split('/');
  const lang = supportedLanguages.includes(path?.[1]) ? path?.[1] : fallbackLng;
  locale.set(lang);

  navigating.subscribe((params) => {
    if (params?.to?.params?.lang) {
      locale.set(params.to?.params?.lang);
    }
  });
}
