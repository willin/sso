import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import pkg from '../package.json';
import { authRouter } from './routes';

const app = new Hono({
  strict: false
});

app.use('*', poweredBy(`v0-sso/${pkg.version}`));
app.route('/auth', authRouter);

app.get('/auth', (c) => {
  return c.json(c.env);
});

export default app;
