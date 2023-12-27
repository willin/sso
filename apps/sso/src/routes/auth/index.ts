import { Hono } from 'hono';
import { router as afdian } from './afdian';
import { router as alipay } from './alipay';
import { router as authorize } from './authorize';
import { router as github } from './github';
import { router as revoke } from './revoke';
import { router as token } from './token';
import { router as userinfo } from './userinfo';

const router = new Hono();

router.route('/', afdian);
router.route('/', alipay);
router.route('/', github);
router.route('/', authorize);
router.route('/', token);
router.route('/', revoke);
router.route('/', userinfo);

export { router as authRouter };
