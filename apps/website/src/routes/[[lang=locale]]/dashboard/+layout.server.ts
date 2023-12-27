import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const { user } = await parent();
  if (!user) {
    redirect(307, '/login');
  }
};
