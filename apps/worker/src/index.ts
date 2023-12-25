import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import pkg from '../package.json';

const app = new Hono();

app.use('*', poweredBy(`${pkg.name}/${pkg.version}`));

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/auth/github/*', (c) => {
  return c.text('Hello Github!');
});

export default app;
