import express from 'express';

const cpuRouter = express.Router();

import * as cpuController from '../../controllers/cpuController.js';

cpuRouter.get('/utilization', cpuController.utilization);

cpuRouter.post('/chart', cpuController.chartUtilization);

export default cpuRouter;
