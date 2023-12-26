import { afdianAuth } from '@hono-dev/auth-afdian';
import { Hono } from 'hono';

const router = new Hono();

router.use('/afdian/*', afdianAuth());
router.get('/afdian/*', (c) => {
  const user = c.get('user');
  const session = c.get('session');
  let viewer = session.get('user');

  const afdianUser = c.get('afdian-user');
  const formattedUser = {
    id: `${afdianUser.user_id}`,
    username: afdianUser.name,
    display_name: afdianUser.name,
    photos: [{ value: afdianUser.avatar }],
    _json: afdianUser
  };

  if (viewer) {
    const bindedUid = await user.getUserIdFromThirdUser(
      'afdian',
      formattedUser.id
    );
    // Bind thid login method to the user
    if (!bindedUid) {
      await user.bindThirdUser(viewer.id, 'afdian', formattedUser);
      return c.redirect('/dashboard');
    }
  }
  // Register the user
  viewer = await user.getUserByThirdUser('afdian', formattedUser);
  session.set('user', viewer);
  return c.redirect('/dashboard', 307);
});

export { router };
