import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';

const app = new Hono();

app.use('*', poweredBy());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/auth/github/*', (c) => {
  return c.text('Hello Github!');
});

export default app;
