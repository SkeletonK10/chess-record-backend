import Router from 'express';
import { test, getPlayerList } from './api';

const router = Router();

router.get("/", getPlayerList);

export default router;
