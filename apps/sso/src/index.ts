import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import pkg from '../package.json';
import { authRouter } from './routes/auth';
import { ssoRouter } from './routes/sso';

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

app.route('/auth', ssoRouter);
app.route('/auth', authRouter);

export default app;
