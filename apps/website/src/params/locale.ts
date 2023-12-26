import { getLocales } from '@svelte-dev/i18n';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
  return getLocales().includes(param);
};
