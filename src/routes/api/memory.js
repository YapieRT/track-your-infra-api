import express from 'express';

const memoryRouter = express.Router();

import * as memoryController from '../../controllers/memoryController.js';

memoryRouter.get('/utilization', memoryController.utilization);

memoryRouter.post('/chart', memoryController.chartUtilization);

export default memoryRouter;
