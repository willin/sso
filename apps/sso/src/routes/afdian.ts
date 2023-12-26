import { afdianAuth } from '@hono-dev/auth-afdian';
import { Hono } from 'hono';

const router = new Hono();

router.use('/afdian/*', afdianAuth());
router.get('/alipay/*', (c) => {
  const token = c.get('alipay-token');
  const user = c.get('alipay-user');

  return c.json({
    token,
    user
  });
});

export { router };
