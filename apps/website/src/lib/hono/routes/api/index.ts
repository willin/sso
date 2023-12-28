import { Hono } from 'hono';
import { router as apps } from './apps';
import { router as users } from './users';

const router = new Hono();

router.route('/', apps);
router.route('/', users);

export { router as apiRouter };
