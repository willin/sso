import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { injectServices } from '../middleware/inject';
import { returnToRedirect } from '../middleware/redirect';
import { router as afdian } from './afdian';
import { router as alipay } from './alipay';
import { router as authorize } from './authorize';
import { router as github } from './github';
import { router as revoke } from './revoke';
import { router as token } from './token';
import { router as userinfo } from './userinfo';

const router = new Hono();

router.use(
  '*',
  cors({
    origin: '*',
    credentials: true,
    exposeHeaders: ['Content-Length', 'X-Powered-By'],
    maxAge: 3600
  })
);
router.use('*', injectServices());

const login = new Hono();
login.use('*', returnToRedirect());
login.route('/', afdian);
login.route('/', alipay);
login.route('/', github);

router.route('/', login);
router.route('/', authorize);
router.route('/', token);
router.route('/', revoke);
router.route('/', userinfo);

export { router as authRouter };
