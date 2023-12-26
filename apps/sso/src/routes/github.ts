import { githubAuth } from '@hono-dev/auth-github';
import { Hono } from 'hono';

const router = new Hono();

router.use('/github/*', githubAuth());
router.get('/github/*', async (c) => {
  const user = c.get('user');
  const session = c.get('session');
  let viewer = session.get('user');

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
    const bindedUid = await user.getUserIdFromThirdUser(
      'github',
      formattedUser.id
    );
    // Bind thid login method to the user
    if (!bindedUid) {
      await user.bindThirdUser(viewer.id, 'github', formattedUser);
      return c.redirect('/dashboard');
    }
  }
  // Register the user
  viewer = await user.getUserByThirdUser('github', formattedUser);
  session.set('user', viewer);
  return c.redirect('/dashboard');
});

export { router };
