import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import pkg from '../package.json';
import { apiRouter } from './routes/api';
import { authRouter } from './routes/auth';

const app = new Hono({
  strict: false
});

app.use('*', poweredBy(`v0-sso/${pkg.version}`));
app.use(
  '*',
  cors({
    origin: '*',
    credentials: true,
    exposeHeaders: ['Content-Length', 'X-Powered-By'],
    maxAge: 3600
  })
);

app.route('/auth', apiRouter);
app.route('/auth', authRouter);

export default app;
