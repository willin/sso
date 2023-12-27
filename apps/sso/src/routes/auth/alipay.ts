import { alipayAuth } from '@hono-dev/auth-alipay';
import { Hono } from 'hono';
import { callbackOrBindRedirect } from '../../utils/safe-redirect';

const router = new Hono();

router.use('/alipay/*', alipayAuth());
router.get('/alipay/*', async (c) => {
  const s = c.get('services');
  let viewer = s.session.get('user');

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
    const bindedUid = await s.user.getUserIdFromThirdUser(
      'alipay',
      formattedUser.id
    );
    // Bind thid login method to the user
    if (!bindedUid) {
      await s.user.bindThirdUser(viewer.id, 'alipay', formattedUser);
      return c.redirect('/dashboard');
    }
  }
  // Register the user
  viewer = await s.user.getUserByThirdUser('alipay', formattedUser);
  s.session.set('user', viewer);
  return callbackOrBindRedirect(c, '/dashboard');
});

export { router };
