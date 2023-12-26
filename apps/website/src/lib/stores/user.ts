import { writable } from 'svelte/store';
import { z } from 'zod';
import { browser } from '$app/environment';

const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  avatar: z.string(),
  type: z.string(),
  membership: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export type User = z.infer<typeof UserSchema>;

export const loading = writable(true);
export const user = writable<User | null>(null);

if (browser) {
  //  @typescript-eslint/no-floating-promises
  void fetch('/api/userinfo', { withCredentials: true })
    .then((res) => res.json())
    .then((result) => {
      user.set(result);
    })
    .finally(() => {
      loading.set(false);
    });
}
