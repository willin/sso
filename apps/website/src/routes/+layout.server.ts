import { type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = ({ locals }) => {
  return {
    user: locals.user
  };
};
