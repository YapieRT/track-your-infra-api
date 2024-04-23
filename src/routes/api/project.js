import express from 'express';

const projectRouter = express.Router();

import * as projectController from '../../controllers/projectController.js';

projectRouter.get('/isConfigured', projectController.isConfigured);

projectRouter.get('/test', projectController.test);

export default projectRouter;
