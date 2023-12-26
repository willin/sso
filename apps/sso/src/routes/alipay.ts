import { alipayAuth } from '@hono-dev/auth-alipay';
import { Hono } from 'hono';

const router = new Hono();

router.use('/alipay/*', alipayAuth());
router.get('/alipay/*', async (c) => {
  const user = c.get('user');
  const session = c.get('session');
  let viewer = session.get('user');

  const alipayUser = c.get('alipay-user');
  const alipayToken = c.get('alipay-token');
  const formattedUser = {
    id: `${alipayUser.user_id}`,
    username: alipayUser.nick_name,
    display_name: alipayUser.nick_name,
    photos: [{ value: alipayUser.avatar }],
    _json: { ...alipayUser, token: alipayToken }
  };

  if (viewer) {
    const bindedUid = await user.getUserIdFromThirdUser(
      'alipay',
      formattedUser.id
    );
    // Bind thid login method to the user
    if (!bindedUid) {
      await user.bindThirdUser(viewer.id, 'alipay', formattedUser);
      return c.redirect('/dashboard');
    }
  }
  // Register the user
  viewer = await user.getUserByThirdUser('alipay', formattedUser);
  session.set('user', viewer);
  return c.redirect('/dashboard', 307);
});

export { router };
