import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import pkg from '../package.json';
import { authRouter } from './routes';

const app = new Hono({
  strict: false
});

app.use('*', poweredBy(`v0-sso/${pkg.version}`));
app.use(
  '*',
  timing({
    totalDescription: false,
    crossOrigin: true
  })
);
app.use(
  '*',
  cors({
    origin: '*',
    credentials: true,
    exposeHeaders: [
      'content-length',
      'x-powered-by',
      'timing-allow-origin',
      'server-timing'
    ],
    maxAge: 3600
  })
);
app.route('/auth', authRouter);

app.get('/auth', (c) => {
  return c.json(c.env);
});

export default app;
