import { afdianAuth } from '@hono-dev/auth-afdian';
import { Hono } from 'hono';
import { callbackOrBindRedirect } from '../../utils/safe-redirect';

const router = new Hono();

router.use('/afdian/*', afdianAuth());
router.get('/afdian/*', async (c) => {
  const s = c.get('services');
  let viewer = s.session.get('user');

  const afdianUser = c.get('afdian-user');
  const formattedUser = {
    id: `${afdianUser.user_id}`,
    username: afdianUser.name,
    display_name: afdianUser.name,
    photos: [{ value: afdianUser.avatar }],
    _json: afdianUser
  };

  if (viewer) {
    const bindedUid = await s.user.getUserIdFromThirdUser(
      'afdian',
      formattedUser.id
    );
    // Bind thid login method to the user
    if (!bindedUid) {
      await s.user.bindThirdUser(viewer.id, 'afdian', formattedUser);
      return c.redirect('/dashboard');
    }
  }
  // Register the user
  viewer = await s.user.getUserByThirdUser('afdian', formattedUser);
  s.session.set('user', viewer);
  return callbackOrBindRedirect(c, '/dashboard');
});

export { router };
