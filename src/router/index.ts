import Router from 'express';
import { dbTestAndWelcome } from './api';
import game from './game';
import gamelist from './gamelist';
import player from './player';
import playerlist from './playerlist';
import validation from './validation';

const router = Router();

router.get("/", dbTestAndWelcome);

router.use("/game/", game);
router.use("/gamelist/", gamelist);
router.use("/player/", player);
router.use("/playerlist/", playerlist);
router.use("/validation/", validation);

export default router;
