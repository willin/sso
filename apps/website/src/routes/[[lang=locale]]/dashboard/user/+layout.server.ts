import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const { user } = await parent();
  if (!user || user.type !== 'admin') {
    redirect(307, '/login');
  }
};
