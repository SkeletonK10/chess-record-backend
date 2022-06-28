import Router from 'express';
import { test, insertGame } from './api';

const router = Router();

router.get("/", test);
router.post("/", insertGame);

export default router;
