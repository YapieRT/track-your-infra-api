import express from 'express';

const systemRouter = express.Router();

import * as systemController from '../../controllers/systemController.js';

systemRouter.get('/info', systemController.info);

systemRouter.get('/uptime', systemController.uptime);

systemRouter.get('/processes', systemController.processes);

export default systemRouter;
