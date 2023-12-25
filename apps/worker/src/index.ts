import { afdianAuth } from '@hono-dev/auth-afdian';
import { githubAuth } from '@hono-dev/auth-github';
import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import pkg from '../package.json';

const app = new Hono();

app.use('*', poweredBy(`v0-sso/${pkg.version}`));

app.use('/auth/afdian/*', afdianAuth());
app.use('/auth/github/*', githubAuth());

app.get('/auth/afdian/*', (c) => {
  const user = c.get('afdian-user');

  return c.json({
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
