import { Hono } from 'hono';
import { router as apps } from './apps';

const router = new Hono();

router.route('/', apps);

export { router as apiRouter };
