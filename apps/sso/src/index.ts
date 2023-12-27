import { poweredBy } from '@hono-dev/powered-by';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import pkg from '../package.json';
import { injectServices } from './middleware/inject';
import { apiRouter } from './routes/api';
import { authRouter } from './routes/auth';

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
app.use('*', injectServices());
app.route('/auth', authRouter);
app.route('/api', apiRouter);

export default app;
