import { githubAuth } from '@hono-dev/auth-github';
import { Hono } from 'hono';

const router = new Hono();

router.use('/github/*', githubAuth());
router.get('/github/*', (c) => {
  const token = c.get('github-token');
  const user = c.get('github-user');

  return c.json({
    token,
    user
  });
});

export { router };
