import express from 'express';

const logsRouter = express.Router();

import * as logsController from '../../controllers/logsController.js';

logsRouter.get('/doesExist', logsController.doesLogsExists);

logsRouter.get('/getLogs', logsController.getLogs);

export default logsRouter;
