import Router from 'express';

import { validateNotationAPI } from './api';

const router = Router();

router.get("/notation/", validateNotationAPI);

export default router;
