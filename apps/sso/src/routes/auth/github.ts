import { githubAuth } from '@hono-dev/auth-github';
import { Hono } from 'hono';
import { callbackOrBindRedirect } from '../../utils/safe-redirect';

const router = new Hono();

router.use('/github/*', githubAuth());
router.get('/github/*', async (c) => {
  const s = c.get('services');
  let viewer = s.session.get('user');

  const githubToken = c.get('github-token');
  const githubUser = c.get('github-user');
  const formattedUser = {
    id: `${githubUser.id}`,
    username: githubUser.login?.toLowerCase(),
    display_name: githubUser.name,
    photos: [{ value: githubUser.avatar_url }],
    _json: { ...githubUser, token: githubToken }
  };

  if (viewer) {
    const bindedUid = await s.user.getUserIdFromThirdUser(
      'github',
      formattedUser.id
    );
    // Bind thid login method to the user
    if (!bindedUid) {
      await s.user.bindThirdUser(viewer.id, 'github', formattedUser);
      return callbackOrBindRedirect(c, '/dashboard');
    }
  }
  // Register the user
  viewer = await s.user.getUserByThirdUser('github', formattedUser);
  s.session.set('user', viewer);
  return callbackOrBindRedirect(c, '/dashboard');
});

export { router };
