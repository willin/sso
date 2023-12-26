import { Hono } from 'hono';
import { injectServices } from '../middleware/inject';
import { returnToRedirect } from '../middleware/redirect';
import { injectSession } from '../middleware/session';
import { router as afdian } from './afdian';
import { router as alipay } from './alipay';
import { router as authorize } from './authorize';
import { router as github } from './github';
import { router as revoke } from './revoke';
import { router as token } from './token';
import { router as userinfo } from './userinfo';

const router = new Hono();

router.use('*', injectServices());

const login = new Hono();
login.use('*', returnToRedirect());
login.use('*', injectSession());
login.route('/', afdian);
login.route('/', alipay);
login.route('/', github);

router.route('/', login);
router.route('/', authorize);
router.route('/', token);
router.route('/', revoke);
router.route('/', userinfo);

export { router as authRouter };
