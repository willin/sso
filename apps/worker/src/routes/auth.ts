import { afdianAuth } from '@hono-dev/auth-afdian';
import { alipayAuth } from '@hono-dev/auth-alipay';
import { githubAuth } from '@hono-dev/auth-github';
import { Hono } from 'hono';
import { returnToRedirect } from '../middleware/redirect';

const router = new Hono();

router.use('*', returnToRedirect());

router.use('/afdian/*', afdianAuth());
router.use('/alipay/*', alipayAuth());
router.use('/github/*', githubAuth());

router.get('/afdian/*', (c) => {
  const user = c.get('afdian-user');

  return c.json({
    user
  });
});

router.get('/alipay/*', (c) => {
  const token = c.get('alipay-token');
  const user = c.get('alipay-user');

  return c.json({
    token,
    user
  });
});

router.get('/github/*', (c) => {
  const token = c.get('github-token');
  const user = c.get('github-user');

  return c.json({
    token,
    user
  });
});

export { router as authRouter };
