import Router from 'express';
import { test } from '../lib/api/root';

const router = Router();

router.get("/", test);

export default router;
