import { alipayAuth } from '@hono-dev/auth-alipay';
import { Hono } from 'hono';

const router = new Hono();

router.use('/alipay/*', alipayAuth());
router.get('/afdian/*', (c) => {
  const user = c.get('afdian-user');

  return c.json({
    user
  });
});

export { router };
