import express from 'express';

const memoryRouter = express.Router();

import * as memoryController from '../../controllers/memoryController.js';

memoryRouter.get('/utilization', memoryController.utilization);

export default memoryRouter;
