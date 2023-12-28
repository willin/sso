import { Hono } from 'hono';

const router = new Hono();

router.get('/logout', (c) => {
  const s = c.get('services');
  s.session.destroy();
  return c.redirect('/');
});

export { router };
