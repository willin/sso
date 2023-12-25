import { afdianAuth } from '@hono-dev/auth-afdian';
import { alipayAuth } from '@hono-dev/auth-alipay';
import { githubAuth } from '@hono-dev/auth-github';
import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import pkg from '../package.json';

const app = new Hono();

app.use('*', poweredBy(`v0-sso/${pkg.version}`));

app.use('/auth/afdian/*', afdianAuth());
app.use('/auth/alipay/*', alipayAuth());
app.use('/auth/github/*', githubAuth());

app.get('/auth/afdian/*', (c) => {
  const user = c.get('afdian-user');

  return c.json({
    user
  });
});

app.get('/auth/alipay/*', (c) => {
  const token = c.get('alipay-token');
  const user = c.get('alipay-user');

  return c.json({
    token,
    user
  });
});

app.get('/auth/github/*', (c) => {
  const token = c.get('github-token');
  const user = c.get('github-user');

  return c.json({
    token,
    user
  });
});

export default app;
